class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    // add $ for advanced filtering options to match MongoDB operator
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);
    Object.entries(queryObj).forEach(([key, value]) => {
      // array field: search include
      if (key === 'tags') {
        queryObj[key] = {
          $all: value.split(','),
        };
        return;
      }
      if (key === 'ingredients') {
        queryObj[key].ingredientName = {
          $all: value.split(','),
        };
        return;
      }
      // number field: search in range
      if (key === 'calories') {
        if (!value.includes(',')) {
          queryObj[key] = value;
        } else {
          const [min, max] = value
            .split(',')
            .map((num) => parseInt(num.trim()));
          queryObj[key] = {
            $lte: max || 1000000000,
            $gte: min || 0,
          };
        }

        return;
      }
      // text field: search contains
      queryObj[key] = {
        $regex: value,
        $options: 'i',
      };
    });

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-updatedTime');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // when user provide fields to project, we only include these in the response
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // if not provided, we just remove the _v field of mongoose
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // * 1 : to convert a string to a number, || 0 : by default we want number 0
    let page = parseInt(this.queryString.page);
    let limit = parseInt(this.queryString.limit);
    // skip: the number of documents to skip (to current page)
    if (!Number.isNaN(page) && !Number.isNaN(limit)) {
      const skip = page * limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}
module.exports = APIFeatures;
