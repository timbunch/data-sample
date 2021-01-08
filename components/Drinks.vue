<template>
  <v-sheet>
    <v-data-table
        :search="search"
        :items="filteredDrinks"
        :headers="headers"
        :expanded.sync="expanded"
        show-expand
        item-key="id"
    >
      <template v-slot:top>
        <div class="px-4 mb-4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                  v-model="search"
                  label="Search"
                  clearable
              />
            </v-col>
            <v-col cols="6">
              <v-select
                  label="category"
                  multiple
                  :items="categories"
                  v-model="categoryModel"
              />
            </v-col>
          </v-row>
          <v-autocomplete
              label="Ingredients"
              hide-details
              :items="ingredients"
              v-model="ingredientModel"
              multiple
              chips
              deletable-chips
              clearable
          />
        </div>
      </template>
      <template v-slot:item.name="{ item }">
        <strong>{{ item.name }}</strong>
      </template>
      <template v-slot:item.glass="{ item }">
        <v-chip @click="search = search === item.glass ? `` : item.glass">{{ item.glass }}</v-chip>
      </template>
      <template v-slot:item.tags="{ item }">
        <v-chip-group>
          <v-chip v-for="(tag, i) in item.tags" :key="i" @click="search = search === tag ? `` : tag">{{ tag }}</v-chip>
        </v-chip-group>
      </template>
      <template v-slot:item.alcoholic="{ item }">
        <v-icon>{{ item.alcoholic ? mdiCheckCircleOutline : mdiCircleOffOutline }}</v-icon>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row class="py-4">
            <v-col cols="12" sm="4">
              <p class="text-h6">Ingredients:</p>
              <ul class="mb-4">
                <li v-for="(ingredient, i) in item.ingredients" :key="i">
                  <strong>{{ ingredient }}:</strong> {{ item.measure[i] }}
                </li>
              </ul>
            </v-col>
            <v-col cols="12" sm="8">
              <p class="text-h6">Instructions:</p>
              <p>{{ item.instructions }}</p>
            </v-col>
          </v-row>
        </td>
      </template>
    </v-data-table>
  </v-sheet>
</template>
<script>
import {mdiCircleOffOutline, mdiCheckCircleOutline} from '@mdi/js';

export default {
  name: "drinks",
  data() {
    return {
      mdiCircleOffOutline,
      mdiCheckCircleOutline,
      categories: this.mapCategories(),
      categoryModel: [],
      drinks: this.mapDrinks(),
      expanded: [],
      headers: this.$store.state.headers,
      ingredientModel: [],
      ingredients: this.mapIngredients(),
      search: '',
    }
  },
  computed: {
    filteredDrinks() {
      return this.drinks.filter(a => {
        return (!this.categoryModel.length || this.categoryModel.includes(a.category))
            && (!this.ingredientModel.length || this.includesIngredient(a));
      });
    }
  },
  methods: {
    mapDrinks() {
      return this.$store.state.drinks.map(a => {
        return {
          id: a.idDrink,
          name: a.strDrink,
          glass: a.strGlass,
          tags: a.strTags ? a.strTags.split(',') : [],
          category: a.strCategory,
          instructions: a.strInstructions,
          ingredients: this.mapNeedle(a, 'strIngredient'),
          measure: this.mapNeedle(a, 'strMeasure'),
          alcoholic: a.strAlcoholic && a.strAlcoholic === 'Alcoholic'
        };
      })
    },
    mapNeedle(a, needle) {
      const keys = Object.keys(a)
          .filter(key => {
            return a[key] && key.includes(needle);
          })
      const items = new Set();
      keys.forEach(key => items.add(a[key]));
      return Array.from(items)
    },
    mapCategories() {
      const items = new Set();
      this.$store.state.drinks
          .forEach(a => items.add(a.strCategory))
      return Array.from(items);
    },
    mapIngredients() {
      const items = new Set();
      this.$store.state.drinks
          .forEach(a => {
            const ingredients = this.mapNeedle(a, 'strIngredient');
            ingredients.forEach(ingredient => items.add(ingredient));
          })
      return Array.from(items);
    },
    includesIngredient(a) {
      return a.ingredients.filter(ingredient => this.ingredientModel.includes(ingredient)).length;
    }
  }
}
</script>
