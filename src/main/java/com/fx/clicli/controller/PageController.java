package com.fx.clicli.controller;

import javax.websocket.server.PathParam;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PageController {
    /**
     * C哩C哩商品主页
     */
	@RequestMapping("{pageName}")
	public String doIndexUI(@PathVariable String pageName) {
		return pageName;
	} 
}
