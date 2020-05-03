package com.fx.clicli.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 该数据层描述商品的基本信息处理
 */
@Mapper
public interface GoodsDao {
     /**
      * 根据商品姓名查询商品简介
      * @param goodsName
      */
	@Select("select profile from goods where name like concat('%',#{goodsName},'%')")
	String findGoodsByName(String goodsName);
}
