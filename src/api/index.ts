import { POST } from './http'
export default {
  /** 登录 */
  Login: (data: any) => POST('/vue_login', data),
  /** 获取静态数据 */
  GetStaticData: (data: any) => POST('/get_static_data', data),

  /** 用户管理 */
  CreateUser: (data: any) => POST('/create_user', data),
  DeleteUser: (data: any) => POST('/delete_user', data),
  UpdateUser: (data: any) => POST('/update_user', data),
  GetUser: (data: any) => POST('/get_user', data),
  GetUserList: (data: any) => POST('/get_user_list', data),

  /** 角色列表 */
  GetRoleList: (data: any) => POST('/get_role_list', data as any),

  /** 刷新token */
  RefreshToken: (data: any) => POST('/refresh_token', data),

  /** 获取下拉框列表 */
  AgentSelect: () => POST('/agent_select'),

  /** 级联 */
  ProvinceCityDistrict: () => POST('/province_city_district')
}
