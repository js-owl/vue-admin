const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  permission_routes: (state) => state.permission.routes,
  errorLogs: (state) => state.errorLog.logs,
  // operation.js
  operation_img_store: (state) => state.operation.operation_img_store,
  operation_img_json: (state) => state.operation.operation_img_json,
  operation_img_json_obj: (state) => state.operation.operation_img_json_obj,
  operation_action: (state) => state.operation.operation_action,
  // user.js
  token: (state) => state.user.token,
  avatar: () => 'a',
  fio: (state) => {
    const f = state.user.fname ? state.user.fname : ''
    const m = state.user.mname ? state.user.mname : ''
    return state.user.lname + ' ' + f + ' ' + m
  },
  user_id: (state) => state.user.user_id,
  introduction: (state) => state.user.introduction,
  roles: (state) => state.user.roles,
  role_name: (state) => state.user.role_name,
  // sort.js
  // sort_table_props: (state) => state.sort.props,
  // sort_table_order: (state) => state.sort.order,
  // request.js
  flowChart_id: (state) => state.request.flowChart_id,
  comments: (state) => state.request.comments,
  commentsItem: (state) => (id) =>
    state.request.comments.filter((item) => item.object_id === id),
  request_state: (state) => state.request.request_state,
  editable_state: (state) => {
    if (
      state.request.request_state === 'draft' ||
      state.request.request_state === 'work' ||
      state.request.request_state === 'send'
    ) {
      return true
    }
    return false
  }
}
export default getters
