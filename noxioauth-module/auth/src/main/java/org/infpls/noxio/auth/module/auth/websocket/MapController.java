package org.infpls.noxio.auth.module.auth.websocket;

import java.util.*;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/* @TODO: this package/folder is called 'websocket' but should be renamed to 'controller' as that is more accurate */

@Controller
public class MapController {
    final private List<NoxioMap> map = new ArrayList();
  
    @RequestMapping(value = "/map/{map}", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody ResponseEntity getStatus(@PathVariable String map) {
        return new ResponseEntity("{\"status\":\"OK\"}", HttpStatus.OK);
    }
    
    public static class NoxioMap {
      
    }
}
