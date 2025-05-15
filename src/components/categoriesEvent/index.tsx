import React from "react";

const CategoriesEvent: React.FC = () => {
  const categories = [
    { name: "Work", color: "work" },
    { name: "Personal", color: "personal" },
    { name: "Meeting", color: "meeting" },
  ];

  return (
    <div className="categoriesEvent">
      {categories.map((category) => (
        <div key={category.name} className="category">
          <div className={`color-box ${category.color}`}></div>
          <span className="label">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoriesEvent;
