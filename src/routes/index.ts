import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import UserRoutes from './UserRoutes';
import StockRoutes from './StockRoutes';
import JetonRoutes from './JetonRoutes';
import authenticateToken from '@src/services/authenticateToken';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ** Token Router ** //
const tokenRouter = Router();
tokenRouter.get(Paths.GenerateToken.Get, JetonRoutes.generateToken);

// ** User Router ** //
const userRouter = Router();
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.get(Paths.Users.GetOne, UserRoutes.getOne);
userRouter.post(Paths.Users.Login, UserRoutes.login);
userRouter.post(Paths.Users.Register, UserRoutes.register);

userRouter.post(Paths.Users.Add, authenticateToken, UserRoutes.add);
userRouter.put(Paths.Users.Update, authenticateToken, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, authenticateToken, UserRoutes.delete);

// ** Stock Router ** //
const stockRouter = Router();
stockRouter.get(Paths.Stocks.Get, StockRoutes.getAll);
stockRouter.get(Paths.Stocks.GetById, StockRoutes.getOne);
stockRouter.get(Paths.Stocks.GetByStockName, StockRoutes.getByName);
stockRouter.get(Paths.Stocks.GetByShortName, StockRoutes.getByShortName);
stockRouter.get(Paths.Stocks.GetByUnitPrice, StockRoutes.getByUnitPrice);
stockRouter.post(Paths.Stocks.Add, authenticateToken, StockRoutes.add);
stockRouter.put(Paths.Stocks.Update, authenticateToken, StockRoutes.update);
stockRouter.delete(Paths.Stocks.Delete, authenticateToken, StockRoutes.delete_);

apiRouter.use(Paths.GenerateToken.Base, tokenRouter);
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Stocks.Base, stockRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
