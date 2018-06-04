package org.infpls.noxio.auth.module.auth.dao.file;

import java.io.File;
import java.io.IOException;
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
    SOUND("/sound", ".wav");
    
    public final String path, ext;
    Type(String path, String ext) {
      this.path = path;
      this.ext = ext;
    }
  };
  
  public FileDao() { }
  
  @PostConstruct
  public void init() {
    final String path = Settable.getFilePath();
    final File fsDir = new File(path);
    if(fsDir.exists() && !fsDir.isDirectory()) { Oak.log(Oak.Level.ERR, "FileDao::init() - Filestore path is not a valid directory!"); }
    if(fsDir.exists() && !fsDir.canWrite()) { Oak.log(Oak.Level.ERR, "FileDao::init() - Can't write to filestore path!"); }
    if(!fsDir.exists()) { if(!fsDir.mkdirs()) { Oak.log(Oak.Level.ERR, "FileDao::init() - Failed to create filestore directory!"); } }
    for(Type t : Type.values()) {
      final File fsType = new File(path + t.path);
      if(fsType.exists() && !fsType.isDirectory()) { Oak.log(Oak.Level.ERR, "FileDao::init() - Filestore type path is not a valid directory!"); }
      if(!fsType.exists()) { if(!fsDir.mkdirs()) { Oak.log(Oak.Level.ERR, "FileDao::init() - Failed to create filestore type directory!"); } }
    }
  }
  
  public String putFile(Type t, MultipartFile f) {
    final String filename = ID.generate16();
    try {
      final File file = new File(Settable.getFilePath() + t.path + "/" + filename + t.ext);
      if(file.exists()) { throw new IOException("File unexpectedly exists. Abort!"); }
      file.createNewFile();
      f.transferTo(file);
    }
    catch(IOException ex) {
      Oak.log(Oak.Level.WARN, "Error trying to write file to file store.", ex);
      return null;
    }
    return filename;
  }
  
  public boolean deleteFile(Type t, String fn) {
    final File file = new File(Settable.getFilePath() + t.path + fn + t.ext);
    if(!file.exists()) { return true; }
    return file.delete();
  }
  
  public Resource getFile(Type t, String fn) {
    Resource rsc = resourceLoader.getResource("file:" + Settable.getFilePath() + t.path + "/" + fn + t.ext);
    return rsc.exists() ? rsc : null;
  }
}
