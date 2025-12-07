import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { IStock } from "@src/models/Stock";

import { IReq, IRes } from "@src/routes/common/types";
import StockService from "@src/services/StockService";

/******************************************************************************
                                Functions
******************************************************************************/

async function getAll(_: IReq, res: IRes) {
  const stocks = await StockService.getAll();
  return res.status(HttpStatusCodes.OK).json({ stocks });
}

async function getByName(req: IReq, res: IRes) {
  const { name } = req.params;
  const stocks = await StockService.getByName(name as string);
  return res.status(HttpStatusCodes.OK).json({ stocks });
}

async function getByShortName(req: IReq, res: IRes) {
  const { shortName } = req.params;
  const stocks = await StockService.getByShortName(shortName as string);
  return res.status(HttpStatusCodes.OK).json({ stocks });
}

async function getByUnitPrice(req: IReq, res: IRes) {
  const { price } = req.params;
  const stocks = await StockService.getByUnitPrice(Number(price));
  return res.status(HttpStatusCodes.OK).json({ stocks });
}

async function getOne(req: IReq, res: IRes) {
  const { id } = req.params;
  const stock = await StockService.getOneID(id as string);
  if (!stock) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({ error: "Stock non trouvé" });
  }
  return res.status(HttpStatusCodes.OK).json({ stock });
}

async function add(req: IReq, res: IRes) {
  const { stock } = req.body;
  await StockService.addOne(stock as IStock);
  return res.status(HttpStatusCodes.CREATED).end();
}

async function update(req: IReq, res: IRes) {
  const { stock } = req.body;
  await StockService.updateOne(stock as IStock);
  return res.status(HttpStatusCodes.OK).end();
}

async function delete_(req: IReq, res: IRes) {
  const { id } = req.params;
  await StockService.delete(id as string);
  return res.status(HttpStatusCodes.OK).end();
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  getOne,
  getByShortName,
  getByUnitPrice,
  getByName,
  add,
  update,
  delete_,
} as const;
