const MODULE_CODE_PREFIXES = {
  category: "CAT",
  customer: "CUS",
  department: "DEP",
  product: "PRD",
  purchaseOrder: "PO",
  salesOrder: "SO",
  supplier: "SUP",
  transferOrder: "TO",
  warehouse: "WH",
} as const;

export type ModuleCodeKind = keyof typeof MODULE_CODE_PREFIXES;

const pad2 = (value: number) => String(value).padStart(2, "0");

const getLocalDateStamp = (date = new Date()) =>
  [
    date.getFullYear(),
    pad2(date.getMonth() + 1),
    pad2(date.getDate()),
  ].join("");

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const generateModuleCode = (
  kind: ModuleCodeKind,
  existingCodes: Array<string | null | undefined> = [],
) => {
  const prefix = MODULE_CODE_PREFIXES[kind];
  const dateStamp = getLocalDateStamp();
  const pattern = new RegExp(
    `^${escapeRegExp(prefix)}[-_]${dateStamp}[-_](\\d+)$`,
    "i",
  );
  const maxSequence = existingCodes.reduce((max, code) => {
    const match = String(code || "").trim().match(pattern);
    if (!match) return max;
    return Math.max(max, Number(match[1]) || 0);
  }, 0);

  return `${prefix}-${dateStamp}-${String(maxSequence + 1).padStart(3, "0")}`;
};
