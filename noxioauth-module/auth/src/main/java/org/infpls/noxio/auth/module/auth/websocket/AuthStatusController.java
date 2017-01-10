package org.infpls.noxio.auth.module.auth.websocket;

import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthStatusController {
    @RequestMapping(value = "/status", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody ResponseEntity getMessages() {
        return new ResponseEntity("{\"status\":\"OK\"}", HttpStatus.OK);
    }
}
