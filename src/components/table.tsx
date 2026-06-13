import { cls } from "@/lib/dom/utils";

import type { ComponentProps, ReactElement, ReactNode } from "react";

/* ============================================================================================= */

export type TableComposedProps = {
  root?: Partial<TableRootProps>;
  children: ReactNode;
} & ComponentProps<"table">;

export const TableComposed = ({
  children,
  root = {},
  ...rest
}: TableComposedProps): ReactElement<HTMLTableElement> => {
  return (
    <TableRoot {...root}>
      <Table {...rest}>{children}</Table>
    </TableRoot>
  );
};

/* ============================================================================================= */

export type TableRootProps = {
  children: ReactNode;
} & ComponentProps<"div">;

export const TableRoot = ({
  children,
  className,
  ...rest
}: TableRootProps): ReactElement<HTMLDivElement> => {
  return (
    <div className={cls("table", className)} {...rest}>
      {children}
    </div>
  );
};

/* ============================================================================================= */

export type TableProps = {
  children: ReactNode;
} & ComponentProps<"table">;

export const Table = ({ children, ...rest }: TableProps): ReactElement<HTMLTableElement> => {
  return <table {...rest}>{children}</table>;
};
