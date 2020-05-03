package com.fx.clicli.service;

import java.util.List;

import com.fx.clicli.vo.GoodsViewVo;

/**
 * 商品查询模块的业务层
 */
public interface GoodsSearchService {
  
	 /**
     * 根据服务器端传来的商品名进行查询     
     * @param goodsName 商品名
     * @return 返回包含商品名的商品集合
     */
	List<GoodsViewVo> findObjects(String goodsName);
}
