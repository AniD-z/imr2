"use client";

// Components
import PackingListForm from "./PackingListForm";
import PackingListActions from "./PackingListActions";

const PackingListMain = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            <PackingListForm />
            <PackingListActions />
        </div>
    );
};

export default PackingListMain;
