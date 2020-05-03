package com.fx.clicli.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.fx.clicli.vo.GoodsViewVo;

/**
 * 该数据层是商品查询模块
 *
 */
@Mapper
public interface GoodsSearchDao {
    /**
     * 根据服务器端传来的商品名进行查询     
     * @param goodsName 商品名
     * @return 返回包含商品名的商品集合
     */
	List<GoodsViewVo> findObjects(String goodsName);
	
}
