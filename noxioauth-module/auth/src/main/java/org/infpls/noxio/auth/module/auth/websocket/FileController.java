package org.infpls.noxio.auth.module.auth.websocket;

import com.google.gson.*;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import org.infpls.noxio.auth.module.auth.dao.DaoContainer;
import org.infpls.noxio.auth.module.auth.dao.file.FileDao;
import org.infpls.noxio.auth.module.auth.dao.user.UserUnlocks;
import org.infpls.noxio.auth.module.auth.session.NoxioSession;
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
    final UserUploadCredintials uuc = gson.fromJson(creds, UserUploadCredintials.class);
    
    /* validate */
    final NoxioSession session = dao.getUserDao().getSessionByUser(uuc.user);
    if(session == null || !session.getSessionId().equals(uuc.sid)) {
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
    session.getSettings().game.setCustomSoundFile(filename);
    try { session.saveSettings(); }
    catch(IOException ex) {
      try { session.close(ex); }
      catch(IOException ex2) { ex2.printStackTrace(); }
      ex.printStackTrace();
      return new ResponseEntity("Unknown error while saving settings.", HttpStatus.NOT_ACCEPTABLE);
    }
    
    return new ResponseEntity(filename, HttpStatus.OK);
  }
  
  public class UserUploadCredintials {
    public final String user, sid;
    public UserUploadCredintials(String user, String sid) {
      this.user = user; this.sid = sid;
    }
  }
}
