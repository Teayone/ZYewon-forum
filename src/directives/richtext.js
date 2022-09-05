import escapeHtml from "@/utils/escapeHtml";
export default {
  richtext: {
    componentUpdated(el, binding) {
      el.innerHTML = escapeHtml(binding.value);
    },
  },
};
