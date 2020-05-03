package com.fx.clicli.vo;

import java.io.Serializable;

import lombok.Data;
/**
 * 该vo类描述商品搜索页的展示信息
 */
@Data
public class GoodsViewVo implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = -5648006837881062943L;
	// 商品简介
    private String proFile;
    // 商品价格
    private Double price;
    // 商品图片url
    private String picture;
    // 商品page名
    private String page;
    
}
