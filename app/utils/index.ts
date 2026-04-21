export function isDefinedAndNotNull(value: any) {
  return value !== undefined && value !== null;
}

export function openUrl(params: {
  parent_url: string;
  object: string;
  width: number;
  height: number;
}) {
  window.open(
    `${params.parent_url}/${params.object}`,
    "",
    `width=${params.width},height=${params.height}`,
  );
}
