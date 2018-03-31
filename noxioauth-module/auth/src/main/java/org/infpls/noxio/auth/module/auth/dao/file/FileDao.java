package org.infpls.noxio.auth.module.auth.dao.file;

import java.io.File;
import java.io.IOException;
import javax.annotation.PostConstruct;
import org.infpls.noxio.auth.module.auth.util.ID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileDao {
  @Value("${filestore.path}")
  private String storePath;  // The path to our user data file store
  
  @Autowired
  private ResourceLoader resourceLoader;
  
  public static enum Type {
    SOUND("/sound/", ".wav");
    
    public final String path, ext;
    Type(String path, String ext) {
      this.path = path;
      this.ext = ext;
    }
  };
  
  public FileDao() { }
  
  @PostConstruct
  public void init() {
    final File fsDir = new File(storePath);
    if(fsDir.exists() && !fsDir.isDirectory()) { System.err.println("FileDao::init() - Filestore path is not a valid directory!"); }
    if(fsDir.exists() && !fsDir.canWrite()) { System.err.println("FileDao::init() - Can't write to filestore path!"); }
    if(!fsDir.exists()) { if(!fsDir.mkdirs()) { System.err.println("FileDao::init() - Failed to create filestore directory!"); } }
    for(Type t : Type.values()) {
      final File fsType = new File(storePath + t.path);
      if(fsType.exists() && !fsType.isDirectory()) { System.err.println("FileDao::init() - Filestore type path is not a valid directory!"); }
      if(!fsType.exists()) { if(!fsDir.mkdirs()) { System.err.println("FileDao::init() - Failed to create filestore type directory!"); } }
    }
  }
  
  public String putFile(Type t, MultipartFile f) {
    final String filename = ID.generate16();
    try {
      final File file = new File(storePath + t.path + filename + t.ext);
      if(file.exists()) { throw new IOException("File unexpectedly exists. Abort!"); }
      file.createNewFile();
      f.transferTo(file);
    }
    catch(IOException ex) {
      ex.printStackTrace();
      return null;
    }
    return filename;
  }
  
  public boolean deleteFile(Type t, String fn) {
    final File file = new File(storePath + t.path + fn + t.ext);
    if(!file.exists()) { return true; }
    return file.delete();
  }
  
  public Resource getFile(Type t, String fn) {
    Resource rsc = resourceLoader.getResource("file:" + storePath + t.path + fn + t.ext);
    return rsc.exists() ? rsc : null;
  }
}
