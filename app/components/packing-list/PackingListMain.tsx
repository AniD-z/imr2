"use client";

// Components
import PackingListForm from "./PackingListForm";
import PackingListActions from "./PackingListActions";

type PackingListMainProps = {
    editMode?: boolean;
    packingListNumber?: number;
};

const PackingListMain = ({ editMode, packingListNumber }: PackingListMainProps) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            <PackingListForm />
            <PackingListActions editMode={editMode} packingListNumber={packingListNumber} />
        </div>
    );
};

export default PackingListMain;
