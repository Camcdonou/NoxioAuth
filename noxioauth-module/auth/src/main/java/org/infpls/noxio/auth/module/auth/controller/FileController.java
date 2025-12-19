package org.infpls.noxio.auth.module.auth.controller;

import com.google.gson.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.dao.file.FileDao;
import org.infpls.noxio.auth.module.auth.dao.user.UserUnlocks;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
import org.infpls.noxio.auth.module.auth.util.ID;
import org.infpls.noxio.auth.module.auth.util.Oak;
import org.infpls.noxio.auth.module.auth.util.Scung;
import org.infpls.noxio.auth.module.auth.util.WavFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/* This class handles uploading and retrieval of user files */

@Controller
public class FileController {
  
  @Autowired
  private DaoContainer dao;
  
  @GetMapping("/file/sound/{filename}")
  @ResponseBody
  public ResponseEntity<Resource> getSound(@PathVariable String filename) {
    final Resource file = dao.getFileDao().getFile(FileDao.Type.SOUND, filename);
    return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
  }

  @RequestMapping(value = "/file/sound", method = RequestMethod.POST, consumes = {"multipart/form-data"})
  public @ResponseBody ResponseEntity uploadSound(@RequestPart("creds") String creds, @RequestPart("file") MultipartFile file) {
    final Gson gson = new GsonBuilder().create();
    final UserFileCredentials uuc = gson.fromJson(creds, UserFileCredentials.class);
    
    /* validate */
    final NoxioSession session = dao.getUserDao().getSessionByUser(uuc.user);
    if(session == null || !session.getSessionId().equals(uuc.sid) || session.isGuest()) {
      return new ResponseEntity("Invalid credentials.", HttpStatus.NOT_ACCEPTABLE);
    }
    
    if(!session.getUnlocks().has(UserUnlocks.Key.FT_SOUND)) {
      return new ResponseEntity("You do not have this feature unlocked!", HttpStatus.NOT_ACCEPTABLE);
    }
    
    if(file.getSize() > 1000000) {
      return new ResponseEntity("Filesize exceeds 1MB.", HttpStatus.NOT_ACCEPTABLE);
    }
    
    try {
      final WavFile wf = WavFile.openWavData(file.getBytes());
      wf.close();
    }
    catch(WavFile.WavFileException | IOException ex) {
      return new ResponseEntity("Failed to decode wav file :: " + ex.getMessage(), HttpStatus.NOT_ACCEPTABLE);
    }
    
    /* delete old sound file if it exists */
    final String cs = session.getSettings().game.getCustomSoundFile();
    if(!dao.getFileDao().deleteFile(FileDao.Type.SOUND, cs)) {
      return new ResponseEntity("Failed to delete old sound file. Contact support if this problem persists.", HttpStatus.NOT_ACCEPTABLE);
    }
      
    /* write */
    final String filename = dao.getFileDao().putFile(FileDao.Type.SOUND, file);
    if(filename == null) {
      return new ResponseEntity("Failed to upload file.", HttpStatus.NOT_ACCEPTABLE);
    }
    
    session.getSettings().game.setCustomSoundFile(filename);
    try { session.saveSettings(); }
    catch(IOException ex) {
      Oak.log(Oak.Type.SQL, Oak.Level.ERR, "Error while saving settings.", ex);
      try { session.close(ex); }
      catch(IOException ex2) { Oak.log(Oak.Type.SESSION, Oak.Level.ERR, "Error while closing user connection.", ex2); }
      return new ResponseEntity("Unknown error while saving settings.", HttpStatus.NOT_ACCEPTABLE);
    }
    
    return new ResponseEntity(filename, HttpStatus.OK);
  }
  
//  @GetMapping("/file/map/{filename}")
//  @ResponseBody
//  public ResponseEntity<Resource> getCustomMap(@PathVariable String filename) {
//    final Resource file = dao.getFileDao().getFile(FileDao.Type.MAP, filename);
//    return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
//  }
  
  @RequestMapping(value = "/file/maps", method = RequestMethod.GET, produces = "application/json")
  public @ResponseBody ResponseEntity getCustomMapList() {
    List<Resource> maps = dao.getFileDao().getFiles(FileDao.Type.MAP);
    
    final List<MapInfo> mapList = new ArrayList();
    for(int i=0;i<maps.size();i++) {
      final Resource m = maps.get(i);
      try {
        final String data = Scung.readFile(maps.get(i));
        final String[] spl = data.split(";", 2);
        final String fid = m.getFilename().split("\\.", 2)[0];
        final String mn = spl[0];
        final String author = fid.contains("_") ? fid.split("_")[0] : fid;
        mapList.add(new MapInfo(fid, mn, author));
      }
      catch(IOException ex) {
        Oak.log(Oak.Type.SYSTEM, Oak.Level.ERR, "Error parsing custom map: " + m.getFilename(), ex);
      }
    }
    
    final Gson gson = new GsonBuilder().create();
    return new ResponseEntity(gson.toJson(mapList), HttpStatus.OK);
  }
  
  @RequestMapping(value = "/file/map/{filename}", method = RequestMethod.GET, produces = "application/text")
  public @ResponseBody ResponseEntity getCustomMap(@PathVariable String filename) {
    final Resource file = dao.getFileDao().getFile(FileDao.Type.MAP, filename);
    try {
      return new ResponseEntity(Scung.readFile(file), HttpStatus.OK);
    }
    catch(IOException ex) {
      return new ResponseEntity("File not found.", HttpStatus.NOT_FOUND);
    }
  }
  
  @RequestMapping(value = "/file/map", method = RequestMethod.POST, consumes = {"multipart/form-data"})
  public @ResponseBody ResponseEntity uploadMap(@RequestPart("creds") String creds, @RequestPart("file") MultipartFile file) {
    final Gson gson = new GsonBuilder().create();
    final UserFileCredentials uuc = gson.fromJson(creds, UserFileCredentials.class);
    
    /* validate */
    final NoxioSession session = dao.getUserDao().getSessionByUser(uuc.user);
    if(session == null || !session.getSessionId().equals(uuc.sid) || session.isGuest()) {
      return new ResponseEntity("Invalid credentials.", HttpStatus.NOT_ACCEPTABLE);
    }
    
    if(!session.getUnlocks().has(UserUnlocks.Key.FT_LOBBY)) {
      return new ResponseEntity("You do not have this feature unlocked!", HttpStatus.NOT_ACCEPTABLE);
    }
    
    if(file.getSize() > 1000000) {
      return new ResponseEntity("Filesize exceeds 1MB.", HttpStatus.NOT_ACCEPTABLE);
    }

    /* check limit */
    List<Resource> maps = dao.getFileDao().getFiles(FileDao.Type.MAP);
    int count = 0;
    for(Resource r : maps) {
        if(r.getFilename().startsWith(session.getUser() + "_") || r.getFilename().equals(session.getUser() + ".map")) {
            count++;
        }
    }
    if(count >= 10) {
        return new ResponseEntity("You have reached the 10 map limit. Delete an existing map to upload a new one.", HttpStatus.NOT_ACCEPTABLE);
    }
      
    /* write */
    final String filename = session.getUser() + "_" + ID.generate6();
    if(dao.getFileDao().putFile(FileDao.Type.MAP, file, filename) == null) {
      return new ResponseEntity("Failed to upload file.", HttpStatus.NOT_ACCEPTABLE);
    }
    
    return new ResponseEntity("OK", HttpStatus.OK);
  }

  @RequestMapping(value = "/file/map/delete", method = RequestMethod.POST, consumes = {"application/json"})
  public @ResponseBody ResponseEntity deleteMap(@RequestBody String data) {
    final Gson gson = new GsonBuilder().create();
    final UserFileCredentials udc = gson.fromJson(data, UserFileCredentials.class);
    
    /* validate */
    final NoxioSession session = dao.getUserDao().getSessionByUser(udc.user);
    if(session == null || !session.getSessionId().equals(udc.sid) || session.isGuest()) {
      return new ResponseEntity("{\"message\":\"Invalid credentials.\"}", HttpStatus.NOT_ACCEPTABLE);
    }
    
    if(!udc.filename.startsWith(udc.user + "_") && !udc.filename.equals(udc.user)) {
       return new ResponseEntity("{\"message\":\"You do not own this map.\"}", HttpStatus.FORBIDDEN);
    }

    if(!dao.getFileDao().deleteFile(FileDao.Type.MAP, udc.filename)) {
      return new ResponseEntity("{\"message\":\"Failed to delete map file.\"}", HttpStatus.NOT_ACCEPTABLE);
    }
    
    return new ResponseEntity("{\"message\":\"OK\"}", HttpStatus.OK);
  }
  
  public static class UserFileCredentials {
    public final String user, sid, filename;
    public UserFileCredentials(String user, String sid, String filename) {
      this.user = user; this.sid = sid; this.filename = filename;
    }
  }
  
    public class MapInfo {
      public final String id, name, author;
      public MapInfo(String id, String name, String author) {
        this.id = id; this.name = name; this.author = author;
      }
    }
}
