<script setup lang="ts">
import { Heart } from '@lucide/vue'
import { computed } from 'vue'
import wechatRewardQrcode from '@/assets/images/wechat-reward-qrcode.jpg'
import PanelDialog from '@/components/shared/panel-dialog/PanelDialog.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { t } = useI18n()

const dialogOpen = computed({
  get: () => props.open,
  set: (val: boolean) => emit(`update:open`, val),
})
</script>

<template>
  <PanelDialog
    v-model:open="dialogOpen"
    :title="t('fund.title')"
    :description="t('fund.description')"
    :icon="Heart"
  >
    <div class="px-4 py-4 sm:px-6">
      <img
        :src="wechatRewardQrcode"
        :alt="t('fund.qrAlt')"
        class="mx-auto w-full max-w-[240px] rounded-xl ring-1 ring-border"
      >
    </div>
  </PanelDialog>
</template>
