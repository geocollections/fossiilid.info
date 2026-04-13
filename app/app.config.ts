export default defineAppConfig({
  ui: {
    colors: {
      primary: "tomato",
    },
    input: {
      variants: {
        size: {
          xl: { base: "p-4 my-2" },
        },
      },
    },
    selectMenu: {
      variants: {
        size: {
          xl: { base: "p-4 my-2" },
        },
      },
    },
    button: {
      variants: {
        size: {
          xl: { base: "p-2" },
        },
      },
    },
    switch: {
      slots: {
        root: "py-2",
      },
    },
    card: {
      slots: {
        root: "dark:bg-gray-800 dark:divide-gray-700 dark:ring-gray-700",
        header: "text-base font-bold px-2 py-4 sm:px-4",
      },
    },
  },
});
