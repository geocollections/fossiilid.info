export default defineAppConfig({
  ui: {
    colors: {
      primary: "tomato",
    },
    card: {
      slots: {
        root: "dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700",
        header: "text-base font-bold px-2 py-4 sm:px-4",
      },
    },
  },
});
