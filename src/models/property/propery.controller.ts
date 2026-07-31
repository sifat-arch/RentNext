import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./porperty.service";
import { sendResponse } from "../../utils/sendResponce";
import httpstatus from "http-status";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const landLordId = req.user?.id;

    console.log("the payload", payload);

    const result = await propertyService.createPropertyIntoDB(
      landLordId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "User registered successfully",
      data: result,
    });
  },
);

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;

    const result = await propertyService.getAllPorpertiesFromDB(query);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "all Properties registered successfully",
      data: result,
    });
  },
);

const updateProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const landLordId = req.user?.id;

    console.log("id is ", id);
    const payload = req.body;

    const result = await propertyService.updatePropertiesIntoDB(
      id as string,
      payload,
      landLordId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "Update Properties  successfully",
      data: result,
    });
  },
);

const deleteProperty = async (req: Request, res: Response) => {
  const landLordId = req.user?.id;
  await propertyService.deletePropertyFromDB(
    req.params.id as string,
    landLordId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Property deleted successfully",
    data: null,
  });
};

const getLandlordProperty = async (req: Request, res: Response) => {
  const landLordId = req.user?.id;
  console.log("controler landlerod id", landLordId);
  const result = await propertyService.getLandlordPropertiesFromDB(
    landLordId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Property deleted successfully",
    data: result,
  });
};

const getSingleProperty = catchAsync(async (req, res) => {
  const result = await propertyService.getSinglePropertyFromDB(
    req.params.propertyId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Property retrieved successfully",
    data: result,
  });
});
export const propertyController = {
  createProperty,
  getAllProperties,
  updateProperties,
  deleteProperty,
  getLandlordProperty,
  getSingleProperty,
};
