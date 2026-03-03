<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { notification } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useNavigationStore } from '#/stores';

const navigationStore = useNavigationStore();

const data = ref<Record<string, any>>();

const getTitle = computed(() =>
  data.value?.create
    ? $t('ui.modal.create', { moduleName: $t('page.navigation.moduleName') })
    : $t('ui.modal.update', { moduleName: $t('page.navigation.moduleName') }),
);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('page.navigation.name'),
      componentProps: {
        placeholder: $t('ui.placeholder.input'),
        allowClear: true,
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'location',
      label: $t('page.navigation.location'),
      componentProps: {
        placeholder: $t('ui.placeholder.input'),
        allowClear: true,
      },
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'locale',
      label: $t('page.navigation.locale'),
      componentProps: {
        placeholder: 'zh-CN',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      component: 'Switch',
      fieldName: 'isActive',
      label: $t('page.navigation.isActive'),
      defaultValue: true,
      componentProps: {
        class: 'w-auto',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'itemsJson',
      label: $t('page.navigation.items'),
      componentProps: {
        rows: 12,
        placeholder:
          '[{title: "Home", url: "/", linkType: "LINK_TYPE_CUSTOM"}]',
      },
      help: $t('page.navigation.placeholder.itemsJsonHelp'),
    },
  ],
});

const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },

  async onConfirm() {
    const validate = await baseFormApi.validate();
    if (!validate.valid) {
      return;
    }

    setLoading(true);

    const values = await baseFormApi.getValues();
    let items: any[] = [];

    if (values.itemsJson && String(values.itemsJson).trim()) {
      try {
        const parsed = JSON.parse(values.itemsJson);
        if (Array.isArray(parsed)) {
          items = parsed;
        } else {
          notification.error({
            message: $t('page.navigation.validation.itemsJsonInvalid'),
          });
          setLoading(false);
          return;
        }
      } catch {
        notification.error({
          message: $t('page.navigation.validation.itemsJsonInvalid'),
        });
        setLoading(false);
        return;
      }
    }

    const payload = {
      isActive: values.isActive,
      items,
      locale: values.locale,
      location: values.location,
      name: values.name,
    };

    try {
      await (data.value?.create
        ? navigationStore.createNavigation(payload)
        : navigationStore.updateNavigation(data.value?.row?.id, payload));

      notification.success({
        message: data.value?.create
          ? $t('ui.notification.create_success')
          : $t('ui.notification.update_success'),
      });
      drawerApi.close();
    } catch {
      notification.error({
        message: data.value?.create
          ? $t('ui.notification.create_failed')
          : $t('ui.notification.update_failed'),
      });
    } finally {
      setLoading(false);
    }
  },

  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }

    data.value = drawerApi.getData<Record<string, any>>();
    const row = data.value?.row;

    if (row) {
      baseFormApi.setValues({
        isActive: row.isActive,
        itemsJson: JSON.stringify(row.items || [], null, 2),
        locale: row.locale,
        location: row.location,
        name: row.name,
      });
    } else {
      baseFormApi.setValues({
        isActive: true,
        itemsJson: '[]',
      });
    }

    setLoading(false);
  },
});

function setLoading(loading: boolean) {
  drawerApi.setState({ loading });
}
</script>
<template>
  <Drawer :title="getTitle" class="w-[720px]">
    <BaseForm />
  </Drawer>
</template>
