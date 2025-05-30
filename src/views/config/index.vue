<template>
  <div class="p-4">
    <header class="mb-2!">
      <NFlex justify="space-between" align="center">
        <NFlex align="center" :size="8">
          <NIcon :size="16">
            <ArrowLeftOutlined class="cursor-pointer" @click="onRollback" />
          </NIcon>
          <span>{{ title }}</span>
        </NFlex>
        <NButton @click="onSave" type="primary"> 保存 </NButton>
      </NFlex>
    </header>
    <div>
      <NForm label-placement="left" :model="formValue" ref="formRef">
        <NGrid x-gap="12">
          <NFormItemGi :span="7" path="name" label="名称">
            <NInput v-model:value="formValue.name" placeholder="请输入名称" />
          </NFormItemGi>
          <NFormItemGi path="description" span="7" label="描述">
            <NInput v-model:value="formValue.description" placeholder="请输入描述" />
          </NFormItemGi>
        </NGrid>
        <NGrid>
          <NFormItemGi span="24" label="配置项" />
        </NGrid>
        <NGrid v-for="(item, index) in formValue.value" x-gap="12">
          <NFormItemGi :path="`value[${index}].value`" span="7" label="值">
            <NInput v-model:value="item.value" placeholder="请输入值" />
          </NFormItemGi>
          <NFormItemGi :path="`value[${index}].trigger`" span="7" label="目标">
            <NInput v-model:value="item.trigger" placeholder="请输入目标" />
          </NFormItemGi>
          <NFormItemGi :path="`value[${index}].description`" span="7" label="描述">
            <NInput v-model:value="item.description" placeholder="请输入描述" />
          </NFormItemGi>
          <NFormItemGi span="3">
            <NButton @click="() => onDelete(index)" type="error" text>删除</NButton>
          </NFormItemGi>
        </NGrid>
      </NForm>
      <NButton @click="onAdd" dashed class="w-full!">新增</NButton>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { NIcon, NFlex, NForm, NFormItemGi, NInput, type FormInst, NGrid, NButton } from 'naive-ui'
import { ArrowLeftOutlined } from '@vicons/antd'
import { EMode, type TFormData } from '@/types'
import { computed, ref, watch } from 'vue'
import { O_TITLE } from './const'
const modelMode = defineModel<EMode>('mode')
const formRef = ref<FormInst | null>(null)
const formValue = ref<TFormData>({
  name: '',
  description: '',
  value: [
    {
      value: '',
      trigger: '',
      description: '',
    },
  ],
})

const title = computed(() => {
  return O_TITLE[modelMode.value || EMode.CREATE]
})

const onRollback = () => {
  modelMode.value = EMode.LIST
}

const onAdd = () => {
  formValue.value.value.push({
    value: '',
    trigger: '',
    description: '',
  })
}

const onDelete = (index: number) => {
  formValue.value.value.splice(index, 1)
}

const onSave = async () => {
  // @ts-ignore
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  // @ts-ignore
  const _value = await chrome.storage.local.get(tab.url)
  console.log('🚀 ~ onSave ~ _value:', _value, formValue.value)
  // @ts-ignore
  await chrome.storage.local.set({
    [tab.url]: [...(_value[tab.url] || []), formValue.value],
  })
  modelMode.value = EMode.LIST
}
</script>
