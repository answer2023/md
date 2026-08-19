<script setup lang="ts">
import { ExternalLink, HelpCircle } from '@lucide/vue'
import { computed } from 'vue'
import wechatMpQrcode from '@/assets/images/wechat-mp-qrcode.jpg'
import PanelDialog from '@/components/shared/panel-dialog/PanelDialog.vue'
import { Button } from '@/components/ui/button'

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

// This fork first, then upstream credit. Labels are proper nouns, no i18n needed.
const links = [
  { label: `GitHub`, url: `https://github.com/answer2023/md` },
  { label: `doocs/md`, url: `https://github.com/doocs/md` },
]

function onRedirect(url: string) {
  window.open(url, `_blank`, `noopener,noreferrer`)
}
</script>

<template>
  <PanelDialog
    v-model:open="dialogOpen"
    :title="t('about.title')"
    :description="t('about.description')"
    :icon="HelpCircle"
  >
    <div class="space-y-4 px-4 py-4 text-center sm:px-6">
      <p class="text-sm text-muted-foreground">
        {{ t('about.followHint') }}
      </p>
      <img
        class="mx-auto max-w-[200px] rounded-xl ring-1 ring-border"
        :src="wechatMpQrcode"
        :alt="t('about.imageAlt')"
      >
      <div class="grid grid-cols-3 gap-2">
        <Button
          v-for="link in links"
          :key="link.url"
          variant="outline"
          class="h-10 min-w-0 gap-1.5 px-2"
          @click="onRedirect(link.url)"
        >
          <ExternalLink class="size-3.5 shrink-0" />
          <span class="truncate text-xs sm:text-sm">{{ link.label }}</span>
        </Button>
      </div>
    </div>
  </PanelDialog>
</template>
