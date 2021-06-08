/**
 * 左侧菜单配置
 */
import React from 'react'
import { AreaChartOutlined, createFromIconfontCN } from '@ant-design/icons'
import { iconFonts, icons } from './iconfont'

const isDev = process.env.APP_ENV === 'development'

// iconfont.cn
const IconFont = createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_1492696_4ai9rbngxhe.js'
  scriptUrl: 'http://at.alicdn.com/t/font_1492696_4ai9rbngxhe.js'
})

export interface IMenu {
  title: string
  path: string
  fullPath?: string
  icon?: React.ReactNode
  subs?: Array<IMenu>
  electron?: boolean
}

export default [
  {
    title: '驾校',
    path: '/Home',
    icon: <IconFont type='icon-RectangleCopy172' />,
    subs: [
      {
        title: '桐庐',
        path: '/Tonglu',
        fullPath: '/Home/WebSocket'
      },
      // {
      //   title: '万里',
      //   path: '/Edge',
      //   fullPath: '/Home/Edge'
      // }
    ]
  }
] as Array<IMenu>
