<template>
  <main class="p-4">
    <NFlex>
      <NDataTable :data="dataSource" :columns="columns" />
      <NButton @click="onAdd" dashed type="primary" class="w-full!">新增</NButton>
    </NFlex>
  </main>
</template>

<script setup lang="tsx">
import { EAction, EMode, type TAction, type TFormData } from '@/types'
import { NButton, NDataTable, NFlex, type DataTableColumn } from 'naive-ui'
import { onMounted, ref } from 'vue'

const modelMode = defineModel<EMode>('mode')

const dataSource = ref<TFormData[]>([
  {
    name: 'admin',
    value: [
      {
        value: 'admin',
        trigger: '#username',
        description: '用户名',
      },
      {
        value: 'sailing2018.',
        trigger: '#passwd',
        description: '密码',
      },
    ],
  },
])

const onAdd = () => {
  modelMode.value = EMode.CREATE
}

const onFill = async (_data: TFormData) => {
  console.log('🚀 ~ onFill ~ _data:', _data)
  // @ts-ignore
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  // @ts-ignore
  await chrome.tabs.sendMessage(tab.id, {
    action: EAction.FILL,
    data: _data.value,
  } as TAction)
}

const onDelete = async (index: number) => {
  // @ts-ignore
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  // @ts-ignore
  const _value = await chrome.storage.local.get(tab.url)
  // @ts-ignore
  await chrome.storage.local.set({
    [tab.url]: _value[tab.url].filter((_: TFormData, i: number) => i !== index),
  })
}

const columns: DataTableColumn<TFormData>[] = [
  {
    title: '名称',
    key: 'name',
    width: '50%',
  },
  {
    title: '操作',
    key: 'actions',
    width: '50%',
    render(row, index) {
      return (
        <NFlex>
          <NButton onClick={() => onDelete(index)} text type="error">
            删除
          </NButton>
          <NButton type="primary" text onClick={() => onFill(row)}>
            填入
          </NButton>
        </NFlex>
      )
    },
  },
]

onMounted(async () => {
  // @ts-ignore
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  // @ts-ignore
  const _value = await chrome.storage.local.get(tab.url)
  dataSource.value = _value[tab.url] || []
  // @ts-ignore
  chrome.storage.local.onChanged.addListener((changes) => {
    console.log(
      '🚀 ~ chrome.storage.local.onChanged.addListener ~ changes[tab.url].newValue:',
      changes[tab.url].newValue,
    )

    if (tab.url in changes) {
      dataSource.value = changes[tab.url].newValue
    }
  })
})
</script>
