package org.infpls.noxio.auth.module.auth.controller;

import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthGeneric {
    @RequestMapping(value = "/unsubscribe", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody ResponseEntity getStatus() {
        return new ResponseEntity("Not supported yet. Email support@20xx.io if you need help.", HttpStatus.OK);
    }
}
