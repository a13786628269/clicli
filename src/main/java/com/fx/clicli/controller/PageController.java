package com.fx.clicli.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PageController {
    /**
     * C哩C哩商品主页
     */
	@RequestMapping("index")
	public String doIndexUI() {
		return "index";
	}
	/**
	 * C哩C哩商品查询页
	 */
	@RequestMapping("search")
	public String doSearchUI() {
		return "search";
	}
}
