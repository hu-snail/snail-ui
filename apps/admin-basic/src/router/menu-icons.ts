/**
 * Icon registry for backend-driven menu items. The mock service (and a real
 * backend) send a stable string name; the template owns the lucide-vue-next
 * mapping, so no component references ever cross the API boundary.
 */
import type { Component } from 'vue';
import { BookOpen, Globe, House, Languages, Palette, Rocket, Route } from 'lucide-vue-next';

export const MenuIcon: Record<string, Component> = {
  house: House,
  'book-open': BookOpen,
  rocket: Rocket,
  globe: Globe,
  route: Route,
  palette: Palette,
  languages: Languages,
};
