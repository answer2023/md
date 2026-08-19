import type { IConfigOption } from '../types'
import type { ThemeName } from './theme-css'

export {
  baseCSSContent,
  type BuiltinThemeName,
  isBuiltinThemeName,
  themeMap,
  type ThemeName,
} from './theme-css'

export const themeOptionsMap = {
  default: {
    label: `经典`,
    value: `default`,
    desc: ``,
  },
  grace: {
    label: `优雅`,
    value: `grace`,
    desc: `@brzhang`,
  },
  simple: {
    label: `简洁`,
    value: `simple`,
    desc: `@okooo5km`,
  },
  azure: {
    label: `湛蓝`,
    value: `azure`,
    desc: `mdnice 风`,
  },
  sunset: {
    label: `暖橙`,
    value: `sunset`,
    desc: `mdnice 风`,
  },
  fresh: {
    label: `青葱`,
    value: `fresh`,
    desc: `mdnice 风`,
  },
  ink: {
    label: `墨韵`,
    value: `ink`,
    desc: `杂志长文`,
  },
  typodoc: {
    label: `文稿`,
    value: `typodoc`,
    desc: `Typora 风`,
  },
  newsprint: {
    label: `报刊`,
    value: `newsprint`,
    desc: `Typora 风`,
  },
  warmpaper: {
    label: `暖笺`,
    value: `warmpaper`,
    desc: `Claude 风 · 固定色`,
  },
  mistblue: {
    label: `雾蓝`,
    value: `mistblue`,
    desc: `Typora 风 · 固定色`,
  },
  gothic: {
    label: `哥特`,
    value: `gothic`,
    desc: `Typora 风 · 固定色`,
  },
  purpletea: {
    label: `紫青`,
    value: `purpletea`,
    desc: `Typora 风 · 固定色`,
  },
}

export const themeOptions: IConfigOption<ThemeName>[] = [
  {
    label: `经典`,
    value: `default`,
    desc: ``,
  },
  {
    label: `优雅`,
    value: `grace`,
    desc: `@brzhang`,
  },
  {
    label: `简洁`,
    value: `simple`,
    desc: `@okooo5km`,
  },
  {
    label: `湛蓝`,
    value: `azure`,
    desc: `mdnice 风`,
  },
  {
    label: `暖橙`,
    value: `sunset`,
    desc: `mdnice 风`,
  },
  {
    label: `青葱`,
    value: `fresh`,
    desc: `mdnice 风`,
  },
  {
    label: `墨韵`,
    value: `ink`,
    desc: `杂志长文`,
  },
  {
    label: `文稿`,
    value: `typodoc`,
    desc: `Typora 风`,
  },
  {
    label: `报刊`,
    value: `newsprint`,
    desc: `Typora 风`,
  },
  {
    label: `暖笺`,
    value: `warmpaper`,
    desc: `Claude 风 · 固定色`,
  },
  {
    label: `雾蓝`,
    value: `mistblue`,
    desc: `Typora 风 · 固定色`,
  },
  {
    label: `哥特`,
    value: `gothic`,
    desc: `Typora 风 · 固定色`,
  },
  {
    label: `紫青`,
    value: `purpletea`,
    desc: `Typora 风 · 固定色`,
  },
]
