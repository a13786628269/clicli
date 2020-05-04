package com.fx.DaoTest;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.fx.clicli.dao.GoodsDao;
import com.fx.clicli.dao.GoodsSearchDao;
import com.fx.clicli.service.GoodsSearchService;
import com.fx.clicli.vo.GoodsViewVo;

@SpringBootTest
public class GoodsSearchTest {
     
	@Autowired
	private GoodsSearchService GoodsSearchService;
	
	@Autowired
	private GoodsDao  goodsDao;
	@Test
	public void Test() {

	}
}
