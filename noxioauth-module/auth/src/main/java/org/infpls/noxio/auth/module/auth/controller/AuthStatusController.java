package org.infpls.noxio.auth.module.auth.controller;

import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/* @TODO: this package/folder is called 'websocket' but should be renamed to 'controller' as that is more accurate */

@Controller
public class AuthStatusController {
    @RequestMapping(value = "/status", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody ResponseEntity getStatus() {
        return new ResponseEntity("{\"status\":\"OK\"}", HttpStatus.OK);
    }
}
