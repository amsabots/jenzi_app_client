export const task_actions = {
  load_jobs: function (jobs_array) {
    return {
      type: 'LOAD_JOBS',
      payload: jobs_array,
    };
  },
  update_job: function (job_item) {
    return {
      type: 'UPDATE_TASK',
      payload: job_item,
    };
  },
  delete_job: function (job_item) {
    return {
      type: 'REMOVE_TASK',
      payload: job_item,
    };
  },
  add_job_entry: function (job_item) {
    return {
      type: 'ADD_TASK',
      payload: job_item,
    };
  },
  //SET_SELECTED
  set_selected_job: function (job_item) {
    return {
      type: 'SET_SELECTED',
      payload: job_item,
    };
  },
  reset_store: function () {
    return {
      type: 'RESET_TASKS',
    };
  },
  set_current_project: function (task_requirements, task_title) {
    return {
      type: 'SET_CURRENT_PROJECT',
      payload: {
        title: task_title,
        requirements: task_requirements,
      },
    };
  },
  //UNSET_CURRENT_PROJECT
  unset_current_project: function (current_project_obj) {
    return {
      type: 'UNSET_CURRENT_PROJECT',
    };
  },
};
