package com.fx.clicli.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fx.clicli.common.vo.JsonResult;
import com.fx.clicli.service.GoodsSearchService;
import com.fx.clicli.vo.GoodsViewVo;

/**
 * 该层为商品查询模块的控制层
 */
@RestController
@RequestMapping("/")
public class GoodsSearchController {
        @Autowired
        private GoodsSearchService goodsSearchService; 
        
        @RequestMapping("doGoodsSearch")
        public JsonResult doGoodsSearch(String goodsName) {
        	List<GoodsViewVo> list = goodsSearchService.findObjects(goodsName);
			return new JsonResult(list);
        }
}
