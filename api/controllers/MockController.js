/**
 * MockController
 * 生成默认数据的控制器，不要重复运行,正式环境请删除该文件
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  add: async function (req, res) {

    let a = await sails.getDatastore().transaction(async function (db, proceed) {
      try {

        await Xt_setting.destroy({});
        await Xt_dict.destroy({});
        await Xt_resource.destroy({});
        await Xt_role_resource.destroy({});
        await Xt_role.destroy({});
        await Xt_user.destroy({});

        //创建基本的字典
        await Xt_dict.create({id: 'user', code: 'user', name: '用户', name_en: 'User'}).usingConnection(db);
        await Xt_dict.create({
          id: 'authority_management',
          code: 'authority_management',
          name: '权限管理',
          name_en: 'Authority management'
        }).usingConnection(db);
        await Xt_dict.create({
          id: 'user_sex',
          code: 'user_sex',
          name: '性别',
          name_en: 'Sex',
          parent_id: 'user'
        }).usingConnection(db);
        await Xt_dict.create({
          id: 'resource_type',
          code: 'resource_type',
          name: '资源类型',
          name_en: 'Resource Type',
          parent_id: 'authority_management'
        }).usingConnection(db);
        await Xt_dict.create({
          id: 'resource_btn',
          code: 'resource_btn',
          name: '按钮',
          name_en: 'Button',
          sorted_num: 2,
          parent_id: 'resource_type'
        }).usingConnection(db);
        await Xt_dict.create({
          id: 'resource_page',
          code: 'resource_page',
          name: '页面',
          name_en: 'Page',
          parent_id: 'resource_type'
        }).usingConnection(db);
        await Xt_dict.create({
          id: 'sex_female',
          code: 'sex_female',
          name: '女',
          name_en: 'Female',
          parent_id: 'user_sex'
        }).usingConnection(db);
        await Xt_dict.create({
          id: 'sex_male',
          code: 'sex_male',
          name: '男',
          name_en: 'Male',
          sorted_num: 2,
          parent_id: 'user_sex'
        }).usingConnection(db);

        let admin = await Xt_user.create({
          nick_name: 'Super admin',
          login_name: 'admin',
          password: PasswordService.pwd("123456")
        }).fetch().usingConnection(db);  //创建管理员账号

        let role = await Xt_role.create({
          name: '超级管理员'
        }).fetch().usingConnection(db);  //创建超级管理员角色

        await Xt_user_role.create({
          role_id: role.id,
          user_id: admin.id
        }).usingConnection(db);   //将管理员账号设置为超级管理员角色

        //创建消息管理
        let message_auth = await Xt_resource.create({
          name: '消息管理',
          res_type_code: 'resource_page',
          icon_path: '&#xe667;',
          sorted_num: 1
        }).fetch().usingConnection(db);
        //创建消息管理子资源
        let auth_message_resources = [
          {
            name: '消息列表',
            res_type_code: 'resource_page',
            sorted_num: 1,
            path: '/admin/message/index',
            parent_id: message_auth.id
          },
          {
            name: '消息添加编辑',
            res_type_code: 'resource_btn',
            sorted_num: 2,
            path: '/admin/message/modify',
            parent_id: message_auth.id
          },
          {
            name: '消息删除',
            res_type_code: 'resource_btn',
            sorted_num: 2,
            path: '/admin/message/delete',
            parent_id: message_auth.id
          },
          {
            name: '发送消息',
            res_type_code: 'resource_btn',
            sorted_num: 2,
            path: '/admin/message/send',
            parent_id: message_auth.id
          },
          {
            name: '消息发送记录',
            res_type_code: 'resource_page',
            sorted_num: 2,
            path: '/admin/message/push_list',
            parent_id: message_auth.id
          },
          {
            name: '短信发送记录',
            res_type_code: 'resource_page',
            sorted_num: 3,
            path: '/admin/message/sms_list',
            parent_id: message_auth.id
          }
        ];
        for (let auth_sub_resource of auth_message_resources) {
          await Xt_resource.create(auth_sub_resource).usingConnection(db);
        }

        //创建权限管理资源
        let resource_auth = await Xt_resource.create({
          name: '权限管理',
          res_type_code: 'resource_page',
          icon_path: '&#xe672;',
          sorted_num: 98
        }).fetch().usingConnection(db);
        await Xt_role_resource.create({
          role_id: role.id,
          resource_id: resource_auth.id
        });

        //创建系统管理资源
        let resource_system = await Xt_resource.create({
          name: '系统管理',
          res_type_code: 'resource_page',
          icon_path: '&#xe716;',
          sorted_num: 99
        }).fetch().usingConnection(db);
        //创建权限管理子资源
        let auth_sub_resources = [
          {
            name: '资源管理',
            res_type_code: 'resource_page',
            sorted_num: 2,
            path: '/admin/xt_resource/index',
            parent_id: resource_auth.id
          },
          {
            name: '资源添加编辑',
            res_type_code: 'resource_btn',
            sorted_num: 2,
            path: '/admin/xt_resource/modify',
            parent_id: resource_auth.id
          },
          {
            name: '资源删除',
            res_type_code: 'resource_btn',
            sorted_num: 2,
            path: '/admin/xt_resource/delete',
            parent_id: resource_auth.id
          },
          {
            name: '角色添加编辑',
            res_type_code: 'resource_btn',
            sorted_num: 2,
            path: '/admin/xt_role/modify',
            parent_id: resource_auth.id
          },
          {
            name: '角色删除',
            res_type_code: 'resource_btn',
            sorted_num: 2,
            path: '/admin/xt_role/delete',
            parent_id: resource_auth.id
          },
          {
            name: '管理员列表',
            res_type_code: 'resource_page',
            sorted_num: 3,
            path: '/admin/xt_user/index',
            parent_id: resource_auth.id
          },
          {
            name: '管理员添加编辑',
            res_type_code: 'resource_btn',
            sorted_num: 2,
            path: '/admin/xt_user/modify',
            parent_id: resource_auth.id
          },
          {
            name: '管理员删除',
            res_type_code: 'resource_btn',
            sorted_num: 2,
            path: '/admin/xt_user/delete',
            parent_id: resource_auth.id
          }
        ];
        for (let auth_sub_resource of auth_sub_resources) {
          await Xt_resource.create(auth_sub_resource).usingConnection(db);
        }

        let xt_role_index = await Xt_resource.create({
          name: '角色管理',
          res_type_code: 'resource_page',
          sorted_num: 1,
          path: '/admin/xt_role/index',
          parent_id: resource_auth.id
        }).fetch().usingConnection(db);
        await Xt_role_resource.create({
          role_id: role.id,
          resource_id: xt_role_index.id
        });

        let distribution_resource = await Xt_resource.create({
          name: '分配资源',
          res_type_code: 'resource_btn',
          sorted_num: 2,
          path: '/admin/xt_role/distribution_resource',
          parent_id: resource_auth.id
        },).fetch().usingConnection(db);
        await Xt_role_resource.create({
          role_id: role.id,
          resource_id: distribution_resource.id
        });

        await Xt_resource.create({
          name: '字典管理',
          res_type_code: 'resource_page',
          sorted_num: 2,
          path: '/admin/xt_dict/index',
          parent_id: resource_system.id
        }).usingConnection(db);
        await Xt_resource.create({
          name: '字典添加编辑',
          res_type_code: 'resource_btn',
          sorted_num: 1,
          path: '/admin/xt_dict/modify',
          parent_id: resource_system.id
        }).usingConnection(db);
        await Xt_resource.create({
          name: '字典删除',
          res_type_code: 'resource_btn',
          sorted_num: 1,
          path: '/admin/xt_dict/delete',
          parent_id: resource_system.id
        }).usingConnection(db);
        await Xt_resource.create({
          name: '站点管理',
          res_type_code: 'resource_page',
          sorted_num: 1,
          path: '/admin/system/site',
          parent_id: resource_system.id
        }).usingConnection(db);
        await Xt_resource.create({
          name: '邮件服务器',
          res_type_code: 'resource_page',
          sorted_num: 3,
          path: '/admin/system/email',
          parent_id: resource_system.id
        }).usingConnection(db);
        await Xt_resource.create({
          name: 'Firebase配置',
          res_type_code: 'resource_page',
          sorted_num: 4,
          path: '/admin/system/firebase',
          parent_id: resource_system.id
        }).usingConnection(db);
        await Xt_resource.create({
          name: 'Nexmo配置',
          res_type_code: 'resource_page',
          sorted_num: 5,
          path: '/admin/system/nexmo',
          parent_id: resource_system.id
        }).usingConnection(db);

        // await Xt_resource.create({
        //   name: 'App版本管理',
        //   res_type_code: 'resource_page',
        //   icon_path: '&#xe678;',
        //   sorted_num: 6,
        //   path: '/admin/xt_app_version/index',
        //   parent_id: resource_system.id
        // }).usingConnection(db);
        // await Xt_resource.create({
        //   name: 'App版本添加编辑',
        //   res_type_code: 'resource_btn',
        //   sorted_num: 1,
        //   path: '/admin/xt_app_version/modify',
        //   parent_id: resource_system.id
        // }).usingConnection(db);
        // await Xt_resource.create({
        //   name: 'App版本删除',
        //   res_type_code: 'resource_btn',
        //   sorted_num: 1,
        //   path: '/admin/xt_app_version/delete',
        //   parent_id: resource_system.id
        // }).usingConnection(db);

        let settings = [
          {
            id: 'system_settings',
            value: [
              {id: 'site_name',value: '后台管理系统'},
              {id: 'maximum_upload_size', value: '10240'}
            ]
          },
          {
            id: 'email_settings',
            value: [
              {id: 'email_host', value: ''},
              {id: 'email_port', value: ''},
              {id: 'email_user', value: ''},
              {id: 'email_password', value: ''},
              {id: 'email_secure', value: '0'},
              {id: 'email_sender', value: ''}
            ]
          },
          {
            id: 'firebase_settings',
            value: [
              {id: 'databaseURL', value: ''},
              {id: 'cert', value: ''},
              {id: 'android_color', value: ''},
              {id: 'android_icon', value: ''}
            ]
          },
          {
            id: 'nexmo_setting',
            value: [
              {id: 'nexmo_api_key', value: ''},
              {id: 'nexmo_api_secret', value: ''},
              {id: 'nexmo_mock', value: '0'}
            ]
          }
        ];
        for (let setting of settings) {
          let big = await Xt_setting.create({
            id: setting.id,
            value: 'object'
          }).fetch().usingConnection(db);
          for (let s of setting.value) {
            await Xt_setting.create({
              id: s.id,
              value: s.value,
              parent: big.id
            }).usingConnection(db);
          }
        }

        proceed(null, {msg: '创建成功'});

      } catch (e) {
        proceed(e);
      }

    });

    let settings = await SystemService.getSettings(null);
    sails.settings = settings;

    return res.json(a);

  }

};

