import React, { useState, useCallback, useEffect } from 'react'
import { Layout } from 'antd'
import { useHistory, useLocation, useStore, connect } from 'umi'
import { ipcRenderer } from 'electron';
import Header from './header'
import SideMenu from './menu'
import store from '@utils/store/'
import styles from './index.less'

const { Content, Sider } = Layout


const BasicLayout: React.FC = (props: any) => {
  const location = useLocation()
  const history = useHistory()
  const [collapsed, setCollapsed] = useState(false)
  const [shopCurrent, setShopCurrent] = useState(store.get(''))

  useEffect(() => {
    const clientAddListener = (event: any, address: string) => {
      props.dispatch({
        type: 'server/addClient',
        payload: address,
      });
    }
    ipcRenderer.on('client-add', clientAddListener);
    return () => {
      ipcRenderer.removeListener('client-add', clientAddListener);
    }
  }, []);

  const clickCollapse = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])
  const changeShop = useCallback(shop => {
    setShopCurrent(shop)
  }, [shopCurrent])

  const LayoutMain = (
    <Layout key={shopCurrent?.cityCode} className={styles.container}>
      <Header
        collapsed={collapsed}
        clickCollapse={clickCollapse}
        changeShop={changeShop}
        shopCurrent={shopCurrent} />
      <Layout>
        {/* 左侧菜单 */}
        <Sider collapsed={collapsed}>
          <SideMenu />
        </Sider>

        {/* 右侧 content */}
        <Layout>
          <Content className={styles.content}>{props.children}</Content>
        </Layout>
      </Layout>
    </Layout>
  )

  const LayoutLogin = props.children

  const LayoutDict: any = {
    '/User/login': LayoutLogin
  }

  return LayoutDict[location.pathname] ? LayoutDict[location.pathname] : LayoutMain
}

export default connect(() => ({}))(BasicLayout);
