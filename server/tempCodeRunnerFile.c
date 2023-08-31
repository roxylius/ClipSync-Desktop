#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct person {
    int id;
    char *name;
    int age;
    int height;
    int weight;
};

void swap(struct person *a, struct person *b) {
    struct person temp = *a;
    *a = *b;
    *b = temp;
}

void minHeapify(struct person arr[], int n, int idx) {
    int smallest = idx;
    int left = 2 * idx + 1;
    int right = 2 * idx + 2;

    if (left < n && arr[left].age < arr[smallest].age)
        smallest = left;

    if (right < n && arr[right].age < arr[smallest].age)
        smallest = right;

    if (smallest != idx) {
        swap(&arr[idx], &arr[smallest]);
        minHeapify(arr, n, smallest);
    }
}

void maxHeapify(struct person arr[], int n, int idx) {
    int largest = idx;
    int left = 2 * idx + 1;
    int right = 2 * idx + 2;

    if (left < n && arr[left].weight > arr[largest].weight)
        largest = left;

    if (right < n && arr[right].weight > arr[largest].weight)
        largest = right;

    if (largest != idx) {
        swap(&arr[idx], &arr[largest]);
        maxHeapify(arr, n, largest);
    }
}

void createMinHeap(struct person arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        minHeapify(arr, n, i);
}

void createMaxHeap(struct person arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        maxHeapify(arr, n, i);
}

int main() {
    int n;
    struct person *people = NULL;
    FILE *file = fopen("data.txt", "r");
    if (file == NULL) {
        printf("Error opening file.\n");
        return 1;
    }

    fscanf(file, "%d", &n);
    people = (struct person *)malloc(n * sizeof(struct person));
    for (int i = 0; i < n; i++) {
        people[i].name = (char *)malloc(100 * sizeof(char));
        fscanf(file, "%d %s %d %d %d", &people[i].id, people[i].name, &people[i].age, &people[i].height, &people[i].weight);
    }
    fclose(file);

    int choice;
    do {
        printf("MAIN MENU (HEAP)\n");
        printf("1. Read Data\n");
        printf("2. Create a Min-heap based on the age\n");
        printf("3. Create a Max-heap based on the weight\n");
        printf("4. Display weight of the youngest person\n");
        printf("5. Insert a new person into the Min-heap\n");
        printf("6. Delete the oldest person\n");
        printf("7. Exit\n");
        printf("Enter option: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                // Data already read from the file
                break;
            case 2:
                createMinHeap(people, n);
                printf("Min-heap created based on age.\n");
                break;
            case 3:
                createMaxHeap(people, n);
                printf("Max-heap created based on weight.\n");
                break;
            case 4:
                printf("Weight of youngest student: %.2f kg\n", people[0].weight / 2.2046);
                break;
            case 5:
                // Implement inserting a new person into the Min-heap
                break;
            case 6:
                // Implement deleting the oldest person
                break;
            case 7:
                printf("Exiting.\n");
                break;
            default:
                printf("Invalid option.\n");
        }
    } while (choice != 7);

    // Free dynamically allocated memory
    for (int i = 0; i < n; i++)
        free(people[i].name);
    free(people);

    return 0;
}