import { Router } from 'express'
import UsersController from './Users'
import FileController from './File'
import ConfigController from './Config'
import CommonController from './Common'
import YonghuController from './Yonghu'
import ShangjiaController from './Shangjia'
import ShangpinzhongleiController from './Shangpinzhonglei'
import ShangpinxinxiController from './Shangpinxinxi'
import ChatController from './Chat'
import ForumController from './Forum'
import CartController from './Cart'
import OrdersController from './Orders'
import AddressController from './Address'
import NewstypeController from './Newstype'
import NewsController from './News'
import StoreupController from './Storeup'
import DiscussshangpinxinxiController from './Discussshangpinxinxi'

export default ({ config, db }) => {
	let api = Router()

	api.use('/users', UsersController({ config, db }))

	api.use('/file', FileController({ config, db }))

	api.use('/config', ConfigController({ config, db }))

	api.use('/', CommonController({ config, db }))

	api.use('/yonghu', YonghuController({ config, db }))

	api.use('/shangjia', ShangjiaController({ config, db }))

	api.use('/shangpinzhonglei', ShangpinzhongleiController({ config, db }))

	api.use('/shangpinxinxi', ShangpinxinxiController({ config, db }))

	api.use('/chat', ChatController({ config, db }))

	api.use('/forum', ForumController({ config, db }))

	api.use('/cart', CartController({ config, db }))

	api.use('/orders', OrdersController({ config, db }))

	api.use('/address', AddressController({ config, db }))

	api.use('/newstype', NewstypeController({ config, db }))

	api.use('/news', NewsController({ config, db }))

	api.use('/storeup', StoreupController({ config, db }))

	api.use('/discussshangpinxinxi', DiscussshangpinxinxiController({ config, db }))

	return api
}
