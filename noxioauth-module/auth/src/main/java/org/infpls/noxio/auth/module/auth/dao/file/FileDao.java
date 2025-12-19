package org.infpls.noxio.auth.module.auth.dao.file;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import org.infpls.noxio.auth.module.auth.util.ID;
import org.infpls.noxio.auth.module.auth.util.Oak;
import org.infpls.noxio.auth.module.auth.util.Settable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileDao {  
  @Autowired
  private ResourceLoader resourceLoader;
  
  public static enum Type {
    SOUND("/sound", ".wav"),
    MAP("/map", ".map");
    
    public final String path, ext;
    Type(String path, String ext) {
      this.path = path;
      this.ext = ext;
    }
  };
  
  public FileDao() { }
  
  @PostConstruct
  public void init() {
    Settable.update(); // In some enviroments/java/tomcat/spring builds (unknown exact cause??) we can end up calling settable before it's ready
    final String path = Settable.getFilePath();
    final File fsDir = new File(path);
    if(fsDir.exists() && !fsDir.isDirectory()) { Oak.log(Oak.Type.SYSTEM, Oak.Level.ERR, "FileDao::init() - Filestore path is not a valid directory!"); }
    if(fsDir.exists() && !fsDir.canWrite()) { Oak.log(Oak.Type.SYSTEM, Oak.Level.ERR, "FileDao::init() - Can't write to filestore path!"); }
    if(!fsDir.exists()) { if(!fsDir.mkdirs()) { Oak.log(Oak.Type.SYSTEM, Oak.Level.ERR, "FileDao::init() - Failed to create filestore directory!"); } }
    for(Type t : Type.values()) {
      final File fsType = new File(path + t.path);
      if(fsType.exists() && !fsType.isDirectory()) { Oak.log(Oak.Type.SYSTEM, Oak.Level.ERR, "FileDao::init() - Filestore type path is not a valid directory!"); }
      if(!fsType.exists()) { if(!fsType.mkdirs()) { Oak.log(Oak.Type.SYSTEM, Oak.Level.ERR, "FileDao::init() - Failed to create filestore type directory!"); } }
    }
  }
  
  public String putFile(Type t, MultipartFile f) {
    final String filename = ID.generate32();
    return putFile(t, f, filename);
  }
  
  public String putFile(Type t, MultipartFile f, String filename) {
    try {
      final File file = new File(Settable.getFilePath() + t.path + "/" + filename + t.ext);
      f.transferTo(file);
    }
    catch(IOException ex) {
      Oak.log(Oak.Type.SYSTEM, Oak.Level.WARN, "Error trying to write file to file store.", ex);
      return null;
    }
    return filename;
  }
  
  public boolean deleteFile(Type t, String fn) {
    final File file = new File(Settable.getFilePath() + t.path + "/" + fn + t.ext);
    if(!file.exists()) { return true; }
    return file.delete();
  }
  
  public Resource getFile(Type t, String fn) {
    Resource rsc = resourceLoader.getResource("file:" + Settable.getFilePath() + t.path + "/" + fn + t.ext);
    return rsc.exists() ? rsc : null;
  }
  
  public List<Resource> getFiles(Type t) {
    File f = new File(Settable.getFilePath() + t.path);
    File[] files = f.listFiles();
    List<Resource> rscs = new ArrayList();
    if(files != null) {
      for(int i=0;i<files.length;i++) {
        Resource rsc = resourceLoader.getResource("file:" + files[i]);
        rscs.add(rsc);
      }
    }
    return rscs;
  }
}
