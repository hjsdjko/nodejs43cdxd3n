import { version } from '../../package.json'
import { Router } from 'express'
import { Sequelize, Op, QueryTypes } from 'sequelize'
import sequelize from '../models/sequelize'
import toRes from '../lib/toRes'
import ShangjiaModel from '../models/ShangjiaModel'
import md5 from 'md5-node'
import util from '../lib/util'
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

	// 用户登录接口
	api.all('/login', async (req, res) => {

		try {

			let pwd = req.query.password
			let userinfo = await ShangjiaModel.findOne({ where: { shangjiahao: req.query.username, mima: pwd } })
			if (userinfo === null) {
				toRes.session(res, -1, '用户名或密码错误！')
				return
			}


			const token = jwt.sign(
				{
					id: userinfo.dataValues.id,
					username: userinfo.dataValues.shangjiahao,
					role: '商家',
                    loginUserColumn: 'shangjiahao',
                    tableName: 'shangjia'
				},
				config.jwtSecret,
				{
					expiresIn: 60 * 60 * 24 * 1
				}
			)

			userinfo.dataValues.token = token
			userinfo.dataValues.role = '商家'
			userinfo.dataValues.loginUserColumn = 'shangjiahao'
			userinfo.dataValues.tableName = 'shangjia'
			delete userinfo.dataValues.mima
			req.session.userinfo = userinfo


			toRes.session(res, 0, '登录成功！', token)
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})


	// 用户退出接口
	api.all('/logout', (req, res) => {
		
		req.session.destroy(err => {
			toRes.session(res, 0, '退出成功！')
		})
	})

	// 注册接口
	api.post('/register', async (req, res) => {

		try {

			Object.keys(req.body).forEach(item=>{
				if(req.body[item] == '')  delete req.body[item]
			})



			const userinfo = await ShangjiaModel.create(req.body)

			if (userinfo === null) {

				toRes.session(res, -1, '注册失败！')
			} else {

				toRes.session(res, 0, '注册成功！')
			}
		} catch(err) {
			
			toRes.session(res, -2, '请检查是否正确输入或用户名重复！', '', 200)
		}
	})

	// 获取session接口
	api.all('/session', async (req, res) => {

		try {

			toRes.record(res, 0, await ShangjiaModel.findOne({ where: { id: req.session.userinfo === undefined ? jwt.decode(req.headers.token).id : req.session.userinfo.id } }))
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 忘记密码（找回密码）
	api.all('/resetPass', async (req, res) => {

		try {

    	let pwd = '123456'

			await ShangjiaModel.update({
				mima: pwd
			}, {
				where: {
				  shangjiahao: req.query.username
				}
			})

			toRes.session(res, 0, '密码已重置为：123456')
		} catch(err) {
			
			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 分页接口（后端）
	api.get('/page', async (req, res) => {

		try {

			let page = parseInt(req.query.page) || 1
			let limit = parseInt(req.query.limit) || 10
			let sort = req.query.sort || 'id'
			let order = req.query.order || 'asc'

			let where = {}
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
			let mima = req.query.mima
			if (mima) {

				if (mima.indexOf('%') != -1) {
					where.mima = {
						[Op.like]: mima
					}
				} else {
					where.mima = {
						[Op.eq]: mima
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
			let shangjiayouxiang = req.query.shangjiayouxiang
			if (shangjiayouxiang) {

				if (shangjiayouxiang.indexOf('%') != -1) {
					where.shangjiayouxiang = {
						[Op.like]: shangjiayouxiang
					}
				} else {
					where.shangjiayouxiang = {
						[Op.eq]: shangjiayouxiang
					}
				}
			}
			let yingyezhizhao = req.query.yingyezhizhao
			if (yingyezhizhao) {

				if (yingyezhizhao.indexOf('%') != -1) {
					where.yingyezhizhao = {
						[Op.like]: yingyezhizhao
					}
				} else {
					where.yingyezhizhao = {
						[Op.eq]: yingyezhizhao
					}
				}
			}
			let shangpuzhaopian = req.query.shangpuzhaopian
			if (shangpuzhaopian) {

				if (shangpuzhaopian.indexOf('%') != -1) {
					where.shangpuzhaopian = {
						[Op.like]: shangpuzhaopian
					}
				} else {
					where.shangpuzhaopian = {
						[Op.eq]: shangpuzhaopian
					}
				}
			}
			let shangjiajieshao = req.query.shangjiajieshao
			if (shangjiajieshao) {

				if (shangjiajieshao.indexOf('%') != -1) {
					where.shangjiajieshao = {
						[Op.like]: shangjiajieshao
					}
				} else {
					where.shangjiajieshao = {
						[Op.eq]: shangjiajieshao
					}
				}
			}
			let money = req.query.money
			if (money) {

				if (money.indexOf('%') != -1) {
					where.money = {
						[Op.like]: money
					}
				} else {
					where.money = {
						[Op.eq]: money
					}
				}
			}

			let orders =[]
			const sortList = sort.split(",")
			const orderList = order.split(",")
			sortList.forEach((item, index) => {
				orders.push([item,orderList[index]])
			  });
			let result = await ShangjiaModel.findAndCountAll({
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
			let result = await ShangjiaModel.findAll()
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


			let orders =[]
			const sortList = sort.split(",")
			const orderList = order.split(",")
			sortList.forEach((item, index) => {
				orders.push([item,orderList[index]])
			  });
			let result = await ShangjiaModel.findAndCountAll({
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



			const userinfo = await ShangjiaModel.create(req.body)

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



			const userinfo = await ShangjiaModel.create(req.body)

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



			await ShangjiaModel.update(req.body, {
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

			await ShangjiaModel.destroy({
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


			toRes.record(res, 0, await ShangjiaModel.findOne({ where: { id: req.params.id } }))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})


    // 详情接口（前端）
	api.all('/detail/:id', async (req, res) => {

		try {


			toRes.record(res, 0, await ShangjiaModel.findOne({ where: { id: req.params.id } }))
		} catch(err) {

			toRes.session(res, 500, '服务器错误！', '', 500)
		}
	})

	// 获取需要提醒的记录数接口
	api.get('/remind/:columnName/:type', async (req, res) => {

        let where = ' 1=1 '

		try {

			let sql = 'SELECT 0 AS count'
			
			if (req.params.type == 1) {
				if (req.query.remindstart) sql = "SELECT COUNT(*) AS count FROM shangjia WHERE " + where + " AND " + req.params.columnName + " >= '" + req.query.remindstart + "'"
				if (req.query.remindend) sql = "SELECT COUNT(*) AS count FROM shangjia WHERE " + where + " AND " + req.params.columnName + " <= '" + req.query.remindend + "'"

				if (req.query.remindstart && req.query.remindend) {
					sql = "SELECT COUNT(*) AS count FROM shangjia WHERE " + where + " AND " + req.params.columnName + " >= '" + req.query.remindstart + "' AND " + req.params.columnName + " <= '" + req.query.remindend + "'"
				}
			}

			if (req.params.type == 2) {
				if (req.query.remindstart) {
					let remindStart = util.getDateTimeFormat(0 + Number(req.query.remindstart), "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM shangjia WHERE " + where + " AND " + req.params.columnName + " >= '" + remindStart + "'"
				}
				if (req.query.remindend) {
					let remindEnd = util.getDateTimeFormat(req.query.remindend, "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM shangjia WHERE " + where + " AND " + req.params.columnName + " <= '" + remindEnd + "'"
				}

				if (req.query.remindstart && req.query.remindend) {
					let remindStart = util.getDateTimeFormat(0 + Number(req.query.remindstart), "yyyy-MM-dd")
					let remindEnd = util.getDateTimeFormat(req.query.remindend, "yyyy-MM-dd")
					sql = "SELECT COUNT(*) AS count FROM shangjia WHERE " + where + " AND " + req.params.columnName + " >= '" + remindStart + "' AND " + req.params.columnName + " <= '" + remindEnd + "'"
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










	// 分组统计接口
	api.get('/group/:columnName', async (req, res) => {

		try {

			let sql = ""
			let columnName = req.params.columnName
			// let tableName = "shangjia"
			let where = " WHERE 1 = 1 "
			sql = "SELECT COUNT(*) AS total, " + columnName + " FROM shangjia " + where + " GROUP BY " + columnName + " LIMIT 10" 
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
			// let tableName = "shangjia"
			let where = " WHERE 1 = 1 "
			if ("shangjia" == "orders") {
				where += " AND status IN ('已支付', '已发货', '已完成') ";
			}

			sql = "SELECT " + xColumnName + ", SUM(" + yColumnName + ") AS total FROM shangjia " + where + " GROUP BY " + xColumnName + " DESC LIMIT 10"
			
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
			let tableName = "shangjia"
			let where = " WHERE 1 = 1 "
			if ("shangjia" == "orders") {
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













	return api
}
