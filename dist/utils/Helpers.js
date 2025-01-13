"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneDays = exports.oneHourFromNow = exports.fiveMinutesAgo = exports.fifteenMinutesFromNow = exports.ThirtyDaysFromNow = exports.oneYearFromNow = void 0;
// ------------ @ Date function---------------------
const oneYearFromNow = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
exports.oneYearFromNow = oneYearFromNow;
const ThirtyDaysFromNow = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
exports.ThirtyDaysFromNow = ThirtyDaysFromNow;
const fifteenMinutesFromNow = () => new Date(Date.now() + 15 * 60 * 1000);
exports.fifteenMinutesFromNow = fifteenMinutesFromNow;
const fiveMinutesAgo = () => new Date(Date.now() + 5 * 60 * 1000);
exports.fiveMinutesAgo = fiveMinutesAgo;
const oneHourFromNow = () => new Date(Date.now() + 60 * 60 * 1000);
exports.oneHourFromNow = oneHourFromNow;
exports.OneDays = 24 * 60 * 60 * 100;
