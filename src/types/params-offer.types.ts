import {ParamsDictionary} from 'express-serve-static-core';

export type ParamsOfferId = {
  offerId: string;
} | ParamsDictionary

export type ParamsOfferCity = {
  city: string;
} | ParamsDictionary

export type ParamsOfferLimit = {
  limit: string;
} | ParamsDictionary
