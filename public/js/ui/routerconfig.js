//basic
import button from './_common/button'
import grids from './_common/grids'
//view
import tag from './_common/tag'
import tabs from './_common/tabs'
import list from './_common/list'
import table from './_common/table'
import searchbox from './_common/searchbox'
import permission from './_common/permission'
import infoflow from './_common/infoflow'
import echarts from './_common/echarts'
import tips from './_common/tips'
import su from './_common/su'
//Navigation
import navmenu from './_common/navmenu'
import steps from './_common/steps'

const routerData = [
    {
        title: <span className='caption'>使用说明</span>, idf: 'l1-2', attr: {path: 'xx'}, path: 'xx', content: <div className='sb-content'><h1>欢迎到此一游！</h1></div>
    },
    {
        title: '组件', idf: 'components'
    },
    {
        title: 'Basic', parent: 'components', idf: 'basic'
    },
    {
        title: <div className='caption'><span>Button</span><span className='ml4 font-size-12'>按钮</span></div>, parent: 'basic',attr: { path: 'button' }, path: 'button', content: button
    },
    {
        title: <div className='caption'><span>Grids</span><span className='ml4 font-size-12'>栅格</span></div>, parent: 'basic',attr: { path: 'grids' }, path: 'grids', content: grids
    },
    // {
    //     title: 'Form', parent: 'components', idf: 'form'
    // },
    // {
    //     title: <div className='caption'><span>Button</span><span className='ml4 font-size-12'>按钮</span></div>, parent: 'form',attr: { path: 'button' }, path: 'button', content: button
    // },
    // {
    //     title: <div className='caption'><span>Grids</span><span className='ml4 font-size-12'>栅格</span></div>, parent: 'form',attr: { path: 'grids' }, path: 'grids', content: grids
    // },
    {
        title: 'View', parent: 'components', idf: 'view'
    },
    {
        title: <div className='caption'><span>Tag</span><span className='ml4 font-size-12'>标签</span></div>, parent: 'view',attr: { path: 'tag' }, path: 'tag', content: tag
    },
    {
        title: <div className='caption'><span>Tabs</span><span className='ml4 font-size-12'>标签页</span></div>, parent: 'view',attr: { path: 'tabs' }, path: 'tabs', content: tabs
    },
    {
        title: <div className='caption'><span>List</span><span className='ml4 font-size-12'>列表</span></div>, parent: 'view',attr: { path: 'list' }, path: 'list', content: list
    },
    {
        title: <div className='caption'><span>Table</span><span className='ml4 font-size-12'>表格</span></div>, parent: 'view',attr: { path: 'table' }, path: 'table', content: table
    },
    {
        title: <div className='caption'><span>Tree</span><span className='ml4 font-size-12'>树形控件</span></div>, parent: 'view',attr: { path: 'searchbox' }, path: 'searchbox', content: searchbox
    },
    {
        title: <div className='caption'><span>Tree</span><span className='ml4 font-size-12'>权限控件</span></div>, parent: 'view',attr: { path: 'permission' }, path: 'permission', content: permission
    },
    {
        title: <div className='caption'><span>Infoflow</span><span className='ml4 font-size-12'>信息流</span></div>, parent: 'view',attr: { path: 'infoflow' }, path: 'infoflow', content: infoflow
    },
    {
        title: <div className='caption'><span>Echarts</span><span className='ml4 font-size-12'>图表插件</span></div>, parent: 'view',attr: { path: 'echarts' }, path: 'echarts', content: echarts
    },
    {
        title: <div className='caption'><span>Tips</span><span className='ml4 font-size-12'>提示框</span></div>, parent: 'view',attr: { path: 'tips' }, path: 'tips', content: tips
    },
    {
        title: <div className='caption'><span>Sub Sup</span><span className='ml4 font-size-12'>右上角或右下角</span></div>, parent: 'view',attr: { path: 'su' }, path: 'su', content: su
    },
    {
        title: 'Navigation', parent: 'components', idf: 'navigation'
    },
    {
        title: <div className='caption'><span>NavMenu</span><span className='ml4 font-size-12'>导航菜单</span></div>, parent: 'navigation',attr: { path: 'navmenu' }, path: 'navmenu', content: navmenu
    },
    {
        title: <div className='caption'><span>Steps</span><span className='ml4 font-size-12'>步骤条</span></div>, parent: 'navigation',attr: { path: 'steps' }, path: 'steps', content: steps
    },
]
module.exports = routerData