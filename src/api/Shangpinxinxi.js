import { version } from '../../package.json'
import { Router } from 'express'
import { Sequelize, Op, QueryTypes } from 'sequelize'
import sequelize from '../models/sequelize'
import toRes from '../lib/toRes'
import ShangpinxinxiModel from '../models/ShangpinxinxiModel'
import md5 from 'md5-node'
import util from '../lib/util'
import OrdersModel from '../models/OrdersModel'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import ConfigModel from '../models/ConfigModel'
import https from 'https'
import request from 'request'
import qs from 'querystring'
import path from 'path'
import fs from 'fs'
import config from '../config.json'
const redis = require('redis')




export default ({ config, db }) => {
	let api = Router()


	// 分页接口（后端）
	api.get('/page', async (req, res) => {

		try {

			let page = parseInt(req.query.page) || 1
			let limit = parseInt(req.query.limit) || 10
			let sort = req.query.sort || 'id'
			let order = req.query.order || 'asc'

			let where = {}
			let pricestart = req.query.pricestart;
			let priceend = req.query.priceend;
			if (pricestart && priceend) {
				let pricebetween = [];
				pricebetween.push(pricestart);
				pricebetween.push(priceend);
				where.price = {
					[Op.between]: pricebetween
				}
			}
			let shangpinmingcheng = req.query.shangpinmingcheng
			if (shangpinmingcheng) {

				if (shangpinmingcheng.indexOf('%') != -1) {
					where.shangpinmingcheng = {
						[Op.like]: shangpinmingcheng
					}
				} else {
					where.shangpinmingcheng = {
						[Op.eq]: shangpinmingcheng
					}
				}
			}
			let shangpinzhonglei = req.query.shangpinzhonglei
			if (shangpinzhonglei) {

				if (shangpinzhonglei.indexOf('%') != -1) {
					where.shangpinzhonglei = {
						[Op.like]: shangpinzhonglei
					}
				} else {
					where.shangpinzhonglei = {
						[Op.eq]: shangpinzhonglei
					}
				}
			}
			let shangpintupian = req.query.shangpintupian
			if (shangpintupian) {

				if (shangpintupian.indexOf('%') != -1) {
					where.shangpintupian = {
						[Op.like]: shangpintupian
					}
				} else {
					where.shangpintupian = {
						[Op.eq]: shangpintupian
					}
				}
			}
			let shangpinxiangqing = req.query.shangpinxiangqing
			if (shangpinxiangqing) {

				if (shangpinxiangqing.indexOf('%') != -1) {
					where.shangpinxiangqing = {
						[Op.like]: shangpinxiangqing
					}
				} else {
					where.shangpinxiangqing = {
						[Op.eq]: shangpinxiangqing
					}
				}
			}
			let shangjiahao = req.query.shangjiahao
			if (shangjiahao) {

				if (shangjiahao.indexOf('%') != -1) {
					where.shangjiahao = {
						[Op.like]: shangjiahao
					}
				} else {
					where.shangjiahao = {
						[Op.eq]: shangjiahao
					}
				}
			}
			let shangjiamingcheng = req.query.shangjiamingcheng
			if (shangjiamingcheng) {

				if (shangjiamingcheng.indexOf('%') != -1) {
					where.shangjiamingcheng = {
						[Op.like]: shangjiamingcheng
					}
				} else {
					where.shangjiamingcheng = {
						[Op.eq]: shangjiamingcheng
					}
				}
			}
			let lianxidianhua = req.query.lianxidianhua
			if (lianxidianhua) {

				if (lianxidianhua.indexOf('%') != -1) {
					where.lianxidianhua = {
						[Op.like]: lianxidianhua
					}
				} else {
					where.lianxidianhua = {
						[Op.eq]: lianxidianhua
					}
				}
			}
			let shangjiadizhi = req.query.shangjiadizhi
			if (shangjiadizhi) {

				if (shangjiadizhi.indexOf('%') != -1) {
					where.shangjiadizhi = {
						[Op.like]: shangjiadizhi
					}
				} else {
					where.shangjiadizhi = {
						[Op.eq]: shangjiadizhi
					}
				}
			}
			let clicknum = req.query.clicknum
			if (clicknum) {

				if (clicknum.indexOf('%') != -1) {
					where.clicknum = {
						[Op.like]: clicknum
					}
				} else {
					where.clicknum = {
						[Op.eq]: clicknum
					}
				}
			}
			let discussnum = req.query.discussnum
			if (discussnum) {

				if (discussnum.indexOf('%') != -1) {
					where.discussnum = {
						[Op.like]: discussnum
					}
				} else {
					where.discussnum = {
						[Op.eq]: discussnum
					}
				}
			}
			let price = req.query.price
			if (price) {

				if (price.indexOf('%') != -1) {
					where.price = {
						[Op.like]: price
					}
				} else {
					where.price = {
						[Op.eq]: price
					}
				}
			}
			let storeupnum = req.query.storeupnum
			if (storeupnum) {

				if (storeupnum.indexOf('%') != -1) {
					where.storeupnum = {
						[Op.like]: storeupnum
					}
				} else {
					where.storeupnum = {
						[Op.eq]: storeupnum
					}
				}
			}
			// let tableName = req.session.userinfo.tableName
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'shangjia') {
				where.shangjiahao = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).username : req.session.userinfo.shangjiahao
				}
				if (where['userid'] != undefined) {
					delete where.userid
				}
			}

			let orders =[]
			const sortList = sort.split(",")
			const orderList = order.split(",")
			sortList.forEach((item, index) => {
				orders.push([item,orderList[index]])
			  });
			let result = await ShangpinxinxiModel.findAndCountAll({
				order: [orders],
				where,
				offset: (page - 1) * limit,
				limit
			})
			
			result.currPage = page
			result.pageSize = limit

			toRes.page(res, 0, result)
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	  // 分页接口（前端）
	api.get('/lists', async (req, res) => {

		try {
			let result = await ShangpinxinxiModel.findAll()
			toRes.record(res, 0, result)
		} catch(err) {
			
			toRes.session(res, 401, '您的权限不够！', '', 200)
		}
	})

    // 分页接口（前端）
	api.get('/list', async (req, res) => {

		try {

			let page = parseInt(req.query.page) || 1
			let limit = parseInt(req.query.limit) || 10
			let sort = req.query.sort || 'id'
			let order = req.query.order || 'asc'

			let where = {}
			let pricestart = req.query.pricestart;
			let priceend = req.query.priceend;
			if (pricestart && priceend) {
				let pricebetween = [];
				pricebetween.push(pricestart);
				pricebetween.push(priceend);
				where.price = {
					[Op.between]: pricebetween
				}
			}
			let shangpinmingcheng = req.query.shangpinmingcheng
			if (shangpinmingcheng) {

				if (shangpinmingcheng.indexOf('%') != -1) {
					where.shangpinmingcheng = {
						[Op.like]: shangpinmingcheng
					}
				} else {
					where.shangpinmingcheng = {
						[Op.eq]: shangpinmingcheng
					}
				}
			}
			let shangpinzhonglei = req.query.shangpinzhonglei
			if (shangpinzhonglei) {

				if (shangpinzhonglei.indexOf('%') != -1) {
					where.shangpinzhonglei = {
						[Op.like]: shangpinzhonglei
					}
				} else {
					where.shangpinzhonglei = {
						[Op.eq]: shangpinzhonglei
					}
				}
			}
			let shangjiamingcheng = req.query.shangjiamingcheng
			if (shangjiamingcheng) {

				if (shangjiamingcheng.indexOf('%') != -1) {
					where.shangjiamingcheng = {
						[Op.like]: shangjiamingcheng
					}
				} else {
					where.shangjiamingcheng = {
						[Op.eq]: shangjiamingcheng
					}
				}
			}
			let price = req.query.price
			if (price) {

				if (price.indexOf('%') != -1) {
					where.price = {
						[Op.like]: price
					}
				} else {
					where.price = {
						[Op.eq]: price
					}
				}
			}


			let orders =[]
			const sortList = sort.split(",")
			const orderList = order.split(",")
			sortList.forEach((item, index) => {
				orders.push([item,orderList[index]])
			  });
			let result = await ShangpinxinxiModel.findAndCountAll({
				order: [orders],
				where,
				offset: (page - 1) * limit,
				limit
			})
			
			result.currPage = page
			result.pageSize = limit

			toRes.page(res, 0, result)
		} catch(err) {
			
			toRes.session(res, 401, '您的权限不够！', '', 200)
		}
	})


	// 保存接口（后端）
	api.post('/save', async (req, res) => {

		try {

			Object.keys(req.body).forEach(item=>{
				if(req.body[item] == '')  delete req.body[item]
				if(req.body[item] == '' && item == 'sfsh')  req.body[item] = '待审核'
			})



			const userinfo = await ShangpinxinxiModel.create(req.body)

			if (userinfo === null) {

				toRes.session(res, -1, '添加失败！')
			} else {

				toRes.session(res, 0, '添加成功！')
			}
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

    // 保存接口（前端）
	api.post('/add', async (req, res) => {

		try {

			Object.keys(req.body).forEach(item=>{
				if(req.body[item] == '')  delete req.body[item]
				if(req.body[item] == '' && item == 'sfsh')  req.body[item] = '待审核'
			})

			if (jwt.decode(req.headers.token) == null) {
				toRes.session(res, 401, '请登录后再操作', '', 401)
			}



			const userinfo = await ShangpinxinxiModel.create(req.body)

			if (userinfo === null) {

				toRes.session(res, -1, '添加失败！')
			} else {

				toRes.session(res, 0, '添加成功！')
			}
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 更新接口
	api.post('/update', async (req, res) => {

		try {



			await ShangpinxinxiModel.update(req.body, {
				where: {
				  id: req.body.id || 0
				}
			})


			toRes.session(res, 0, '编辑成功！')
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 删除接口
	api.post('/delete', async (req, res) => {

		try {

			await ShangpinxinxiModel.destroy({
				where: {
				  id: {
					[Op.in]: req.body
				  }
				}
			})

			toRes.session(res, 0, '删除成功！')
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 详情接口（后端）
	api.all('/info/:id', async (req, res) => {

		try {

			const recordInfo = await ShangpinxinxiModel.findOne({ where: { id: req.params.id } })
            await recordInfo.increment('clicknum')

			toRes.record(res, 0, await ShangpinxinxiModel.findOne({ where: { id: req.params.id } }))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})


    // 详情接口（前端）
	api.all('/detail/:id', async (req, res) => {

		try {

			const recordInfo = await ShangpinxinxiModel.findOne({ where: { id: req.params.id } })
            await recordInfo.increment('clicknum')

			toRes.record(res, 0, await ShangpinxinxiModel.findOne({ where: { id: req.params.id } }))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 获取需要提醒的记录数接口
	api.get('/remind/:columnName/:type', async (req, res) => {

        let where = ' 1=1 '
		let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
        if(tableName == 'shangjia') {
            where += " AND shangjiahao = '" + jwt.decode(req.headers.token).username + "' ";
        }

		try {

			let sql = 'SELECT 0 AS count'
			
			if (req.params.type == 1) {
				if (req.query.remindstart) sql = "SELECT COUNT(*) AS count FROM shangpinxinxi WHERE " + where + " AND " + req.params.columnName + " >= '" + req.query.remindstart + "'"
				if (req.query.remindend) sql = "SELECT COUNT(*) AS count FROM shangpinxinxi WHERE " + where + " AND " + req.params.columnName + " <= '" + req.query.remindend + "'"

				if (req.query.remindstart && req.query.remindend) {
					sql = "SELECT COUNT(*) AS count FROM shangpinxinxi WHERE " + where + " AND " + req.params.columnName + " >= '" + req.query.remindstart + "' AND " + req.params.columnName + " <= '" + req.query.remindend + "'"
				}
			}

			if (req.params.type == 2) {
				if (req.query.remindstart) {
					let remindStart = util.getDateTimeFormat(0 + Number(req.query.remindstart), "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM shangpinxinxi WHERE " + where + " AND " + req.params.columnName + " >= '" + remindStart + "'"
				}
				if (req.query.remindend) {
					let remindEnd = util.getDateTimeFormat(req.query.remindend, "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM shangpinxinxi WHERE " + where + " AND " + req.params.columnName + " <= '" + remindEnd + "'"
				}

				if (req.query.remindstart && req.query.remindend) {
					let remindStart = util.getDateTimeFormat(0 + Number(req.query.remindstart), "yyyy-MM-dd")
					let remindEnd = util.getDateTimeFormat(req.query.remindend, "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM shangpinxinxi WHERE " + where + " AND " + req.params.columnName + " >= '" + remindStart + "' AND " + req.params.columnName + " <= '" + remindEnd + "'"
				}
			}

			const results = await sequelize.query(sql, {
				plain: true,
				raw: true,
				type: QueryTypes.SELECT
			})

			toRes.count(res, 0, results.count)
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})





	//用户协同算法
	api.get('/autoSort2', async (req, res) => {
		try {
			let page = parseInt(req.query.page) || 1
			let limit = parseInt(req.query.limit) || 5
		
			let orderList = await OrdersModel.findAndCountAll({
				order: [['addtime', 'desc']],
			})
			//用户-订单矩阵
			let userOrderMatrix  = {}
			orderList.rows.forEach(item=>{
				let goodid = item.goodid
				let userid = item.userid
				if(userOrderMatrix .hasOwnProperty(userid)){
					if(userOrderMatrix [userid].hasOwnProperty(goodid)){
						userOrderMatrix [userid][goodid] +=1
					}else{
						userOrderMatrix [userid][goodid]=1
					}
				}else{
					userOrderMatrix [userid] = {
						[goodid]: 1,
					}
				}
			})

			// 找到与当前用户最相似的用户
  			let mostSimilarUser = null;
			let maxSimilarity = -1;
			let userid = jwt.decode(req.headers.token).id
			for (const user in userOrderMatrix) {
				if (user != userid) {
				  const similarity = calculateSimilarity(userid, user,userOrderMatrix);
				  if (similarity > maxSimilarity) {
					maxSimilarity = similarity;
					mostSimilarUser = user;
				  }
				}
			}

			let result
			//根据与用户mostSimilarUser的相似度进行推荐
			if (mostSimilarUser) {
				//找到最相似但目标用户未购买过的商品
				const newDictionary = Object.keys(userOrderMatrix[mostSimilarUser]).reduce((result, key) => {
					if (!userOrderMatrix[userid].hasOwnProperty(key)) {
					  result[key] = userOrderMatrix[mostSimilarUser][key];
					}
					return result;
				  }, {});
				//按评分降序排列推荐
				const sortedDictionary = Object.keys(objectFromEntries(Object.entries(newDictionary).sort((a, b) => b[1] - a[1])));

				result = await ShangpinxinxiModel.findAndCountAll({
					where:{
						id:{[Op.in]:sortedDictionary}
					},
					offset: (page - 1) * limit,
					limit
				})

				let result1 = await ShangpinxinxiModel.findAndCountAll({
					where:{
						id:{[Op.notIn]:sortedDictionary}
					},
					offset: (page - 1) * limit,
					limit: limit - result.count
				})
				result.rows = result.rows.concat(result1.rows)
				result.total = result.count + result1.count
		
			}else{
				result = await ShangpinxinxiModel.findAndCountAll({
					offset: (page - 1) * limit,
					limit
				})
				result.total = result.count
			}

			result.currPage = page
			result.pageSize = limit
			result.count = result.total 
			toRes.page(res, 0, result)
		} catch(err) {
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	function objectFromEntries(entries) {
		var obj = {};
		for (var i = 0; i < entries.length; i++) {
		  var entry = entries[i];
		  obj[entry[0]] = entry[1];
		}
		return obj;
	}

	// 计算用户之间的相似度
	function calculateSimilarity(user1, user2,userOrderMatrix) {
		const user1Orders = userOrderMatrix[user1];
		const user2Orders = userOrderMatrix[user2];

		let commonOrders = 0;
		let totalOrders = 0;

		for (const order in user1Orders) {
		  if (user2Orders.hasOwnProperty(order)) {
			commonOrders += user1Orders[order] * user2Orders[order];
		  }
		  totalOrders += user1Orders[order] ** 2;
		}

		const similarity = commonOrders / Math.sqrt(totalOrders);
		return similarity;
	}






	// 分组统计接口
	api.get('/group/:columnName', async (req, res) => {

		try {

			let sql = ""
			let columnName = req.params.columnName
			// let tableName = "shangpinxinxi"
			let where = " WHERE 1 = 1 "
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'shangjia') {
				where += " AND shangjiahao = '" + jwt.decode(req.headers.token).username + "' ";
			}
			sql = "SELECT COUNT(*) AS total, " + columnName + " FROM shangpinxinxi " + where + " GROUP BY " + columnName + " LIMIT 10" 
			toRes.record(res, 0, await sequelize.query(sql, {
				plain: false,
				raw: true,
				type: QueryTypes.SELECT
			}))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 统计指定字段
	api.get('/value/:xColumnName/:yColumnName', async (req, res) => {

		try {

			let sql = ""
			let xColumnName = req.params.xColumnName
			let yColumnName = req.params.yColumnName
			// let tableName = "shangpinxinxi"
			let where = " WHERE 1 = 1 "
			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'shangjia') {
				where += " AND shangjiahao = '" + jwt.decode(req.headers.token).username + "' ";
			}
			if ("shangpinxinxi" == "orders") {
				where += " AND status IN ('已支付', '已发货', '已完成') ";
			}

			sql = "SELECT " + xColumnName + ", SUM(" + yColumnName + ") AS total FROM shangpinxinxi " + where + " GROUP BY " + xColumnName + " DESC LIMIT 10"
			
			toRes.record(res, 0, await sequelize.query(sql, {
				plain: false,
				raw: true,
				type: QueryTypes.SELECT
			}))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 按日期统计
	api.get('/value/:xColumnName/:yColumnName/:timeStatType', async (req, res) => {

		try {
			
			let sql = ""
			let xColumnName = req.params.xColumnName
			let yColumnName = req.params.yColumnName
			let timeStatType = req.params.timeStatType
			let tableName = "shangpinxinxi"
			let where = " WHERE 1 = 1 "
			if (jwt.decode(req.headers.token).role != '管理员') {
				where += " AND shangjiahao = '" + jwt.decode(req.headers.token).username + "' ";
			}
			if ("shangpinxinxi" == "orders") {
				where += " AND status IN ('已支付', '已发货', '已完成') ";
			}

            if (config.dbConnection.dbtype.toLowerCase() == "mysql") {
                if (timeStatType == "日")
                    sql = "SELECT DATE_FORMAT(" + xColumnName + ", '%Y-%m-%d') " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(" + xColumnName + ", '%Y-%m-%d') LIMIT 10";
                if (timeStatType == "月")
                    sql = "SELECT DATE_FORMAT(" + xColumnName + ", '%Y-%m') " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(" + xColumnName + ", '%Y-%m')  LIMIT 10";
                if (timeStatType == "年")
                    sql = "SELECT DATE_FORMAT(" + xColumnName + ", '%Y') " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(" + xColumnName + ", '%Y')  LIMIT 10";
            } else {
                if (timeStatType == "日")
                    sql = "SELECT DATE_FORMAT(VARCHAR(10)," + xColumnName + ", 120) " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(VARCHAR(10)," + xColumnName + ", 120)  LIMIT 10";
                if (timeStatType == "月")
                    sql = "SELECT DATE_FORMAT(VARCHAR(7)," + xColumnName + ", 120) " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(VARCHAR(7)," + xColumnName + ", 120)  LIMIT 10";
                if (timeStatType == "年")
                    sql = "SELECT DATE_FORMAT(VARCHAR(4)," + xColumnName + ", 120) " + xColumnName + ", sum(" + yColumnName + ") total FROM " + tableName + where + " GROUP BY DATE_FORMAT(VARCHAR(4)," + xColumnName + ", 120)  LIMIT 10";
            }
			toRes.record(res, 0, await sequelize.query(sql, {
				plain: false,
				raw: true,
				type: QueryTypes.SELECT
			}))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})


	// 总数接口
	api.get('/count', async (req, res) => {

		try {
			let where = {}
			var shangpinmingcheng = req.query.shangpinmingcheng
			if (shangpinmingcheng) {

				if (shangpinmingcheng.indexOf('%') != -1) {
					where.shangpinmingcheng = {
						[Op.like]: shangpinmingcheng
					}
				} else {
					where.shangpinmingcheng = {
						[Op.eq]: shangpinmingcheng
					}
				}
			}
			var shangpinzhonglei = req.query.shangpinzhonglei
			if (shangpinzhonglei) {

				if (shangpinzhonglei.indexOf('%') != -1) {
					where.shangpinzhonglei = {
						[Op.like]: shangpinzhonglei
					}
				} else {
					where.shangpinzhonglei = {
						[Op.eq]: shangpinzhonglei
					}
				}
			}
			var shangjiamingcheng = req.query.shangjiamingcheng
			if (shangjiamingcheng) {

				if (shangjiamingcheng.indexOf('%') != -1) {
					where.shangjiamingcheng = {
						[Op.like]: shangjiamingcheng
					}
				} else {
					where.shangjiamingcheng = {
						[Op.eq]: shangjiamingcheng
					}
				}
			}
			var price = req.query.price
			if (price) {

				if (price.indexOf('%') != -1) {
					where.price = {
						[Op.like]: price
					}
				} else {
					where.price = {
						[Op.eq]: price
					}
				}
			}

			let tableName = req.session.userinfo === undefined ? jwt.decode(req.headers.token).tableName : req.session.userinfo.tableName
			if(tableName == 'shangjia') {
				where.shangjiahao = {
					[Op.eq]: req.session.userinfo === undefined ? jwt.decode(req.headers.token).username : req.session.userinfo.shangjiahao
				}
				if (where['userid'] != undefined) {
					delete where.userid
				}
			}
			const count = await ShangpinxinxiModel.count({where});

			toRes.record(res, 0, count)
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})











	return api
}
