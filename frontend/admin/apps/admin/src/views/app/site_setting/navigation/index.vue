<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Page, useVbenDrawer, type VbenFormProps } from '@vben/common-ui';
import { LucideFilePenLine, LucideTrash2 } from '@vben/icons';

import { notification } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { type siteservicev1_Navigation as Navigation } from '#/generated/api/admin/service/v1';
import { $t } from '#/locales';
import { useNavigationStore } from '#/stores';
import NavigationDrawer from '#/views/app/site_setting/navigation/navigation-drawer.vue';

const navigationStore = useNavigationStore();

const formOptions: VbenFormProps = {
  collapsed: false,
  showCollapseButton: false,
  submitOnEnter: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('page.navigation.name'),
      componentProps: {
        placeholder: $t('ui.placeholder.input'),
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'location',
      label: $t('page.navigation.location'),
      componentProps: {
        placeholder: $t('ui.placeholder.input'),
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'locale',
      label: $t('page.navigation.locale'),
      componentProps: {
        placeholder: $t('ui.placeholder.input'),
        allowClear: true,
      },
    },
  ],
};

const gridOptions: VxeGridProps<Navigation> = {
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    zoom: true,
  },
  height: 'auto',
  exportConfig: {},
  pagerConfig: {},
  rowConfig: {
    isHover: true,
  },
  stripe: true,

  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await navigationStore.listNavigation(
          {
            page: page.currentPage,
            pageSize: page.pageSize,
          },
          {
            name: formValues.name,
            location: formValues.location,
            locale: formValues.locale,
          },
          null,
          ['-created_at'],
        );
      },
    },
  },

  columns: [
    {
      title: $t('page.navigation.name'),
      field: 'name',
      minWidth: 140,
    },
    {
      title: $t('page.navigation.location'),
      field: 'location',
      minWidth: 140,
    },
    {
      title: $t('page.navigation.locale'),
      field: 'locale',
      width: 110,
    },
    {
      title: $t('page.navigation.isActive'),
      field: 'isActive',
      width: 100,
      formatter: ({ cellValue }) =>
        cellValue ? $t('ui.text.yes') : $t('ui.text.no'),
    },
    {
      title: $t('page.navigation.items'),
      field: 'items',
      width: 120,
      formatter: ({ cellValue }) => `${cellValue?.length ?? 0}`,
    },
    {
      title: $t('ui.table.createdAt'),
      field: 'createdAt',
      formatter: 'formatDateTime',
      width: 160,
    },
    {
      title: $t('ui.table.action'),
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      width: 90,
    },
  ],
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, formOptions });

const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: NavigationDrawer,
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      gridApi.reload();
    }
  },
});

function openDrawer(create: boolean, row?: any) {
  drawerApi.setData({
    create,
    row,
  });
  drawerApi.open();
}

function handleCreate() {
  openDrawer(true);
}

function handleEdit(row: any) {
  openDrawer(false, row);
}

async function handleDelete(row: any) {
  try {
    await navigationStore.deleteNavigation(row.id);
    notification.success({
      message: $t('ui.notification.delete_success'),
    });
    await gridApi.reload();
  } catch {
    notification.error({
      message: $t('ui.notification.delete_failed'),
    });
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="$t('menu.siteSetting.navigation')">
      <template #toolbar-tools>
        <a-button class="mr-2" type="primary" @click="handleCreate">
          {{ $t('page.navigation.button.create') }}
        </a-button>
      </template>
      <template #action="{ row }">
        <a-button
          type="link"
          :icon="h(LucideFilePenLine)"
          @click.stop="handleEdit(row)"
        />
        <a-popconfirm
          :cancel-text="$t('ui.button.cancel')"
          :ok-text="$t('ui.button.ok')"
          :title="
            $t('ui.text.do_you_want_delete', {
              moduleName: $t('page.navigation.moduleName'),
            })
          "
          @confirm="handleDelete(row)"
        >
          <a-button danger type="link" :icon="h(LucideTrash2)" />
        </a-popconfirm>
      </template>
    </Grid>
    <Drawer />
  </Page>
</template>

<style scoped></style>
