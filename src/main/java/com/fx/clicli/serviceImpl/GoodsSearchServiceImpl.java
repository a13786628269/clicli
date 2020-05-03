package com.fx.clicli.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fx.clicli.common.util.AssertUtil;
import com.fx.clicli.dao.GoodsDao;
import com.fx.clicli.dao.GoodsSearchDao;
import com.fx.clicli.service.GoodsSearchService;
import com.fx.clicli.vo.GoodsViewVo;
/**
 * 商品查询模块的业务层
 */
@Service
public class GoodsSearchServiceImpl implements GoodsSearchService {

	@Autowired
	private GoodsSearchDao goodsSearchDao;
	@Autowired
	private GoodsDao goodsDao;
	
	 /**
     * 根据服务器端传来的商品名进行查询     
     * @param goodsName 商品名
     * @return 返回包含商品名的商品集合
     */
	@Override
	public List<GoodsViewVo> findObjects(String goodsName) {
		List<GoodsViewVo> list = goodsSearchDao.findObjects(goodsName);
		for (int i = 0; i < list.size(); i++) {
			list.get(i).setProFile(goodsDao.findGoodsByName(goodsName));
		}
		AssertUtil.isChecked(list==null, "商品暂时没有,亲!");
		return list;
	}

}
