<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Page, type VbenFormProps } from '@vben/common-ui';
import { LucideFilePenLine, LucideTrash2 } from '@vben/icons';
import { i18n } from '@vben/locales';

import { notification } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { type contentservicev1_Category as Category } from '#/generated/api/admin/service/v1';
import { $t } from '#/locales';
import { router } from '#/router';
import {
  categoryStatusList,
  categoryStatusToColor,
  categoryStatusToName,
  useCategoryStore,
} from '#/stores';

const categoryStore = useCategoryStore();

const formOptions: VbenFormProps = {
  // Default expanded
  collapsed: false,
  // Control whether the form displays a collapse button
  showCollapseButton: false,
  // Whether to submit the form when Enter is pressed
  submitOnEnter: true,
  schema: [
    {
      component: 'Select',
      fieldName: 'status',
      label: $t('page.category.status'),
      componentProps: {
        options: categoryStatusList,
        placeholder: $t('ui.placeholder.select'),
        filterOption: (input: string, option: any) =>
          option.label.toLowerCase().includes(input.toLowerCase()),
        allowClear: true,
        showSearch: true,
      },
    },
  ],
};

const gridOptions: VxeGridProps<Category> = {
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    zoom: true,
  },
  exportConfig: {},
  pagerConfig: {},
  rowConfig: {
    isHover: true,
  },
  height: 'auto',
  stripe: true,
  treeConfig: {
    transform: true,
    rowField: 'id',
    parentField: 'parentId',
  },

  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        console.log('query:', formValues);

        return await categoryStore.listCategory(
          {
            page: page.currentPage,
            pageSize: page.pageSize,
          },
          formValues,
        );
      },
    },
  },

  columns: [
    {
      title: $t('page.category.name'),
      field: 'translations',
      treeNode: true,
      formatter: ({ cellValue }) => {
        if (cellValue && cellValue.length > 0) {
          return cellValue[0]?.name || '';
        }
        return '';
      },
    },
    {
      title: $t('page.category.icon'),
      field: 'icon',
      width: 80,
    },
    {
      title: $t('page.category.isNav'),
      field: 'isNav',
      width: 100,
      formatter: ({ cellValue }) =>
        cellValue ? $t('ui.button.yes') : $t('ui.button.no'),
    },
    {
      title: $t('page.category.postCount'),
      field: 'postCount',
      width: 100,
    },
    {
      title: $t('page.category.directPostCount'),
      field: 'directPostCount',
      width: 120,
    },
    {
      title: $t('page.category.status'),
      field: 'status',
      slots: { default: 'status' },
      width: 100,
    },
    {
      title: $t('ui.table.sortOrder'),
      field: 'sortOrder',
      width: 80,
    },
    {
      title: $t('ui.table.createdAt'),
      field: 'createdAt',
      formatter: 'formatDateTime',
      width: 150,
    },
    {
      title: $t('ui.table.action'),
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      width: 100,
    },
  ],
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, formOptions });

/* Create */
function handleCreate() {
  console.log('Create', i18n.global.locale.value);
  router.push({
    name: 'CreateCategory',
    query: { lang: i18n.global.locale.value },
  });
}

/* Edit */
function handleEdit(row: any) {
  console.log('Edit', row, i18n.global.locale.value);
  router.push({
    name: 'EditCategory',
    params: { id: row.id },
    query: { lang: i18n.global.locale.value },
  });
}

/* Delete */
async function handleDelete(row: any) {
  console.log('Delete', row);

  try {
    await categoryStore.deleteCategory(row.id);

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
    <Grid :table-title="$t('menu.content.category')">
      <template #toolbar-tools>
        <a-button class="mr-2" type="primary" @click="handleCreate">
          {{ $t('ui.button.create') }}
        </a-button>
      </template>
      <template #status="{ row }">
        <a-tag :color="categoryStatusToColor(row.status)">
          {{ categoryStatusToName(row.status) }}
        </a-tag>
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
              moduleName: $t('page.category.moduleName'),
            })
          "
          @confirm="handleDelete(row)"
        >
          <a-button danger type="link" :icon="h(LucideTrash2)" />
        </a-popconfirm>
      </template>
    </Grid>
  </Page>
</template>

<style scoped></style>
